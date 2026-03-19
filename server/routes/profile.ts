import { Router, type IRouter, type Request, type Response } from "express";
import { rtdbGet, rtdbSet, rtdbPush, rtdbQuery } from "../lib/firebaseAdmin.js";
import { UpdateMyProfileBody } from "../schemas.js";

const router: IRouter = Router();

function requireAuth(req: Request, res: Response): string | null {
  const userId = (req.session as any).userId;
  if (!userId) { res.status(401).json({ error: "Not authenticated" }); return null; }
  return userId;
}

router.get("/profile", async (req: Request, res: Response): Promise<void> => {
  const userId = requireAuth(req, res);
  if (!userId) return;

  try {
    const profile = await rtdbGet(`profiles/${userId}`);
    if (!profile) { res.status(404).json({ error: "Profile not found" }); return; }
    res.json({ id: userId, ...profile });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/profile", async (req: Request, res: Response): Promise<void> => {
  const userId = requireAuth(req, res);
  if (!userId) return;

  const parsed = UpdateMyProfileBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  try {
    const existing = await rtdbGet(`profiles/${userId}`) ?? {};
    const updated = { ...existing, ...parsed.data, updatedAt: new Date().toISOString() };
    await rtdbSet(`profiles/${userId}`, updated);
    res.json({ id: userId, ...updated });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to update profile" });
  }
});

export default router;
