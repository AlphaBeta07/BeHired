import { Router, type IRouter, type Request, type Response } from "express";
import { rtdbPush, rtdbQuery } from "../lib/firebaseAdmin.js";
import { CreateSwipeBody } from "../schemas.js";

const router: IRouter = Router();

function requireAuth(req: Request, res: Response): string | null {
  const userId = (req.session as any).userId;
  if (!userId) { res.status(401).json({ error: "Not authenticated" }); return null; }
  return userId;
}

router.post("/swipes", async (req: Request, res: Response): Promise<void> => {
  const userId = requireAuth(req, res);
  if (!userId) return;

  const parsed = CreateSwipeBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const { jobId, direction } = parsed.data;

  try {
    const swipe = {
      user_id: userId,
      job_id: jobId,
      direction,
      created_at: new Date().toISOString(),
    };

    const swipeId = await rtdbPush("swipes", swipe);

    let match = null;
    if (direction === "like") {
      const matchData = {
        user_id: userId,
        job_id: jobId,
        status: "pending",
        created_at: new Date().toISOString(),
      };
      const matchId = await rtdbPush("matches", matchData);
      match = { id: matchId, ...matchData };
    }

    res.status(201).json({ swipe: { id: swipeId, ...swipe }, match });
  } catch (error: any) {
    console.error("[swipe]", error.message);
    res.status(500).json({ error: "Failed to record swipe" });
  }
});

export default router;
