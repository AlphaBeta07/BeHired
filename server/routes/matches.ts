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
    const role = (req.session as any).userRole; // jobseeker or employer

    const allMatchesData = await rtdbGet("matches") || {};
    const allMatchesArray = Object.entries(allMatchesData).map(([id, val]: any) => ({ id, ...val }));
    
    // We only want 'accepted' matches (meaning both parties swiped right)
    let myMatches = allMatchesArray.filter(m => m.status === "accepted");

    if (role === "employer") {
      // Find matches where the employer_id on the job matches userId
      const jobsData = await rtdbQuery("jobs", "employer_id", userId) || {};
      const myJobIds = new Set(Object.keys(jobsData));
      myMatches = myMatches.filter(m => myJobIds.has(m.job_id));
    } else {
      // Jobseeker
      myMatches = myMatches.filter(m => m.user_id === userId);
    }

    const detailedMatches = [];
    for (const match of myMatches) {
      const job = await rtdbGet(`jobs/${match.job_id}`);
      const applicant = await rtdbGet(`profiles/${match.user_id}`);
      
      if (job && applicant) {
        detailedMatches.push({
          id: match.id,
          jobId: match.job_id,
          jobTitle: job.title || "Job",
          company: job.company || "Company",
          companyLogo: job.company_logo || job.companyLogo || "",
          applicantId: match.user_id,
          applicantName: applicant.name || "Applicant",
          applicantAvatar: applicant.avatar || "",
          matchedAt: match.updated_at || match.created_at || new Date().toISOString(),
          status: match.status
        });
      }
    }

    // Sort by most recent match time
    detailedMatches.sort((a, b) => new Date(b.matchedAt).getTime() - new Date(a.matchedAt).getTime());

    res.json(detailedMatches);
  } catch (error: any) {
    console.error("[get matches error]", error);
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
