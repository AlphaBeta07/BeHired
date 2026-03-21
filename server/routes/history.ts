import { Router, type IRouter, type Request, type Response } from "express";
import { rtdbGet, rtdbQuery } from "../lib/firebaseAdmin.js";

const router: IRouter = Router();

function requireAuth(req: Request, res: Response): string | null {
  const userId = (req.session as any).userId;
  if (!userId) { res.status(401).json({ error: "Not authenticated" }); return null; }
  return userId;
}

// GET /api/history
// Returns { accepted: [], rejected: [] } for both roles.
// Jobseeker: looks at their swipes + match status.
// Employer:  looks at matches they've accepted/rejected.
router.get("/history", async (req: Request, res: Response): Promise<void> => {
  const userId = requireAuth(req, res);
  if (!userId) return;

  const role = (req.session as any).userRole;

  try {
    if (role === "jobseeker") {
      // Get all swipes made by this user
      const swipesMap = await rtdbQuery("swipes", "user_id", userId) || {};
      const swipes = Object.entries(swipesMap).map(([id, v]: any) => ({ id, ...v }));

      // For "liked" swipes get their match status
      const matchesMap = await rtdbQuery("matches", "user_id", userId) || {};
      const matchByJobId: Record<string, any> = {};
      for (const m of Object.values(matchesMap)) {
        const match = m as any;
        matchByJobId[match.job_id] = match;
      }

      const accepted = [];
      const rejected = [];

      for (const swipe of swipes) {
        const job = await rtdbGet(`jobs/${swipe.job_id}`);
        if (!job) continue;

        const item = {
          id: swipe.id,
          jobId: swipe.job_id,
          jobTitle: job.title || "Job",
          company: job.company || "Company",
          companyLogo: job.company_logo || job.companyLogo || "",
          location: job.location || "",
          type: job.type || "job",
          swipedAt: swipe.created_at,
          matchStatus: matchByJobId[swipe.job_id]?.status || null,
        };

        if (swipe.direction === "like") {
          accepted.push(item); // Could be pending or confirmed match
        } else {
          rejected.push(item);
        }
      }

      res.json({ accepted, rejected });

    } else {
      // Employer: look at matches they've acted on
      const allMatchesData = await rtdbGet("matches") || {};
      const allMatches = Object.entries(allMatchesData).map(([id, v]: any) => ({ id, ...v }));

      // Get this employer's jobs to filter
      const myJobsData = await rtdbQuery("jobs", "employer_id", userId) || {};
      const myJobIds = new Set(Object.keys(myJobsData));

      const accepted = [];
      const rejected = [];

      for (const match of allMatches) {
        if (!myJobIds.has(match.job_id)) continue;
        if (match.status === "pending") continue; // not yet reviewed

        const job = await rtdbGet(`jobs/${match.job_id}`);
        const applicantProfile = await rtdbGet(`profiles/${match.user_id}`);
        const applicantUser = await rtdbGet(`users/${match.user_id}`);
        if (!job) continue;

        const item = {
          id: match.id,
          jobId: match.job_id,
          jobTitle: job.title || "Job",
          applicantId: match.user_id,
          applicantName: applicantProfile?.name || applicantUser?.name || "Applicant",
          applicantAvatar: applicantProfile?.avatar || "",
          applicantEmail: applicantProfile?.email || applicantUser?.email || "",
          swipedAt: match.updated_at || match.created_at,
        };

        if (match.status === "accepted") {
          accepted.push(item);
        } else if (match.status === "rejected") {
          rejected.push(item);
        }
      }

      res.json({ accepted, rejected });
    }
  } catch (error: any) {
    console.error("[history]", error);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

export default router;
