import { Router, type IRouter, type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import { adminAuth, rtdbGet, rtdbQuery, rtdbSet, rtdbPush } from "../lib/firebaseAdmin.js";
import { RegisterUserBody, LoginUserBody } from "../schemas.js";

const router: IRouter = Router();

router.post("/auth/register", async (req: Request, res: Response): Promise<void> => {
  const parsed = RegisterUserBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const { email, password, name, role } = parsed.data;

  try {
    // Check if email already exists in Realtime DB
    const existing = await rtdbQuery("users", "email", email);
    if (Object.keys(existing).length > 0) {
      res.status(400).json({ error: "Email already registered" }); return;
    }

    // Create user in Firebase Auth (handles secure credential storage)
    const firebaseUser = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    });

    const password_hash = await bcrypt.hash(password, 12);

    const newUser = {
      id: firebaseUser.uid,
      email,
      password_hash,
      name,
      role,
      createdAt: new Date().toISOString(),
    };

    // Store user profile in Realtime DB under /users/{uid}
    await rtdbSet(`users/${firebaseUser.uid}`, newUser);

    (req.session as any).userId = newUser.id;
    (req.session as any).userRole = newUser.role;
    res.status(201).json({ id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role });
  } catch (error: any) {
    console.error("[register] error:", error.code, error.message);
    res.status(500).json({ error: error.message ?? "Failed to create user" });
  }
});

router.post("/auth/login", async (req: Request, res: Response): Promise<void> => {
  const parsed = LoginUserBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const { email, password } = parsed.data;

  try {
    // Look up user by email
    const usersMap = await rtdbQuery("users", "email", email);
    const entries = Object.values(usersMap);
    if (entries.length === 0) { res.status(401).json({ error: "Invalid email or password" }); return; }

    const user: any = entries[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) { res.status(401).json({ error: "Invalid email or password" }); return; }

    (req.session as any).userId = user.id;
    (req.session as any).userRole = user.role;
    res.json({ id: user.id, email: user.email, name: user.name, role: user.role });
  } catch (error: any) {
    console.error("[login] error:", error.message);
    res.status(500).json({ error: "Login failed" });
  }
});

router.post("/auth/logout", async (req: Request, res: Response): Promise<void> => {
  req.session.destroy(() => { res.json({ message: "Logged out successfully" }); });
});

router.get("/auth/me", async (req: Request, res: Response): Promise<void> => {
  const userId = (req.session as any).userId;
  if (!userId) { res.status(401).json({ error: "Not authenticated" }); return; }

  try {
    const user = await rtdbGet(`users/${userId}`);
    if (!user) { res.status(401).json({ error: "User not found" }); return; }
    res.json({ id: user.id, email: user.email, name: user.name, role: user.role });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch session" });
  }
});

export default router;
