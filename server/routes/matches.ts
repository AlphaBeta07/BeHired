import { Router, type IRouter, type Request, type Response } from "express";
import { rtdbGet, rtdbUpdate, rtdbQuery } from "../lib/firebaseAdmin.js";

const router: IRouter = Router();

function requireAuth(req: Request, res: Response): string | null {
  const userId = (req.session as any).userId;
  if (!userId) { res.status(401).json({ error: "Not authenticated" }); return null; }
  return userId;
}

router.get("/matches", async (req: Request, res: Response): Promise<void> => {
  const userId = requireAuth(req, res);
  if (!userId) return;

  try {
    const matchesData = await rtdbQuery("matches", "user_id", userId);
    const matches = matchesData
      ? Object.entries(matchesData).map(([id, val]: any) => ({ id, ...val }))
      : [];
    res.json(matches);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch matches" });
  }
});

router.put("/matches/:id/status", async (req: Request, res: Response): Promise<void> => {
  const userId = requireAuth(req, res);
  if (!userId) return;

  const { id } = req.params;
  const { status } = req.body;
  if (!status) { res.status(400).json({ error: "Missing status" }); return; }

  try {
    await rtdbUpdate(`matches/${id}`, { status, updated_at: new Date().toISOString() });
    res.json({ id, status });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to update match status" });
  }
});

export default router;
