import { Router, type IRouter, type Request, type Response } from "express";
import { rtdbSet, rtdbGet } from "../lib/firebaseAdmin.js";

const router: IRouter = Router();

// POST /api/upload/resume
// Accepts raw PDF bytes with Content-Type: application/pdf
// Stores as base64 in Realtime Database under /resumes/{userId}
// Returns { url: string } — a data URI usable for display/download
router.post("/upload/resume", async (req: Request, res: Response): Promise<void> => {
  const userId = (req.session as any).userId;
  if (!userId) { res.status(401).json({ error: "Not authenticated" }); return; }

  // Collect raw body
  const chunks: Buffer[] = [];
  req.on("data", (chunk: Buffer) => chunks.push(chunk));
  await new Promise<void>((resolve, reject) => {
    req.on("end", resolve);
    req.on("error", reject);
  });
  const buffer = Buffer.concat(chunks);

  if (buffer.length === 0) {
    res.status(400).json({ error: "No file data received" });
    return;
  }

  // Firebase Realtime DB has a 10MB single-node limit — enforce that here
  if (buffer.length > 5 * 1024 * 1024) {
    res.status(400).json({ error: "File too large. Max 5MB for free storage." });
    return;
  }

  try {
    const base64 = buffer.toString("base64");
    const dataUri = `data:application/pdf;base64,${base64}`;

    // Store in RTDB — will be retrievable via /resumes/{userId}
    await rtdbSet(`resumes/${userId}`, {
      data: base64,
      uploadedAt: new Date().toISOString(),
      size: buffer.length,
    });

    // Also update the user's profile resumeUrl with the data URI
    const existing = await rtdbGet(`profiles/${userId}`) ?? {};
    await rtdbSet(`profiles/${userId}`, {
      ...existing,
      resumeUrl: dataUri,
      updatedAt: new Date().toISOString(),
    });

    res.json({ url: dataUri, message: "Resume uploaded and stored successfully." });
  } catch (err: any) {
    console.error("[upload/resume] error:", err.message);
    res.status(500).json({ error: err.message || "Upload failed" });
  }
});

// GET /api/upload/resume — retrieve the user's stored resume as base64
router.get("/upload/resume", async (req: Request, res: Response): Promise<void> => {
  const userId = (req.session as any).userId;
  if (!userId) { res.status(401).json({ error: "Not authenticated" }); return; }

  try {
    const record = await rtdbGet(`resumes/${userId}`);
    if (!record) { res.status(404).json({ error: "No resume found" }); return; }

    res.json({
      url: `data:application/pdf;base64,${record.data}`,
      uploadedAt: record.uploadedAt,
      size: record.size,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
