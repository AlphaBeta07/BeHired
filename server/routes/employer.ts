import { Router, type IRouter, type Request, type Response } from "express";
import { rtdbGet, rtdbQuery, rtdbUpdate, rtdbPush } from "../lib/firebaseAdmin.js";
import { EmployerSwipeBody } from "../schemas.js";

const router: IRouter = Router();

function requireAuth(req: Request, res: Response): string | null {
  const userId = (req.session as any).userId;
  if (!userId) { res.status(401).json({ error: "Not authenticated" }); return null; }
  return userId;
}

// GET /api/employer/applicants/:jobId
// Fetches applicants (swipes basically, or pending matches) for a specific job
router.get("/employer/applicants/:jobId", async (req: Request, res: Response): Promise<void> => {
  const userId = requireAuth(req, res);
  if (!userId) return;

  const { jobId } = req.params;

  try {
    // 1. Verify this employer owns the job
    const job = await rtdbGet(`jobs/${jobId}`);
    if (!job) { res.status(404).json({ error: "Job not found" }); return; }
    if (job.employer_id !== userId) { res.status(403).json({ error: "Unauthorized" }); return; }

    // 2. We look at "matches" to find "pending" applications for this job
    // Actually when a jobseeker likes a job, a "match" with status="pending" is created where user_id=applicant.
    // Let's query matches for this job
    const jobMatches = await rtdbQuery("matches", "job_id", jobId) || {};
    
    // Convert to array and filter
    const matchesArray = Object.entries(jobMatches).map(([id, val]: any) => ({ id, ...val }));
    const pendingMatches = matchesArray.filter(m => m.status === "pending");

    // 3. For each pending match, fetch the applicant's profile
    const applicants = [];
    for (const match of pendingMatches) {
      const profile = await rtdbGet(`profiles/${match.user_id}`);
      if (profile) {
        applicants.push({
          id: match.id, // we give match.id as the id
          applicantId: match.user_id,
          name: profile.name || "Unknown",
          email: profile.email || "",
          avatar: profile.avatar || "",
          bio: profile.bio || "",
          skills: profile.skills || [],
          location: profile.location || "",
          resumeUrl: profile.resumeUrl || "",
          swipedAt: match.created_at || new Date().toISOString()
        });
      }
    }

    res.json(applicants);
  } catch (error: any) {
    console.error("[get job applicants]", error);
    res.status(500).json({ error: "Failed to fetch applicants" });
  }
});

// POST /api/employer/swipe
router.post("/employer/swipe", async (req: Request, res: Response): Promise<void> => {
  const userId = requireAuth(req, res);
  if (!userId) return;

  const parsed = EmployerSwipeBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  
  const { applicantId, jobId, direction } = parsed.data;

  try {
    // 1. Verify this employer owns the job
    const job = await rtdbGet(`jobs/${jobId}`);
    if (!job || job.employer_id !== userId) { res.status(403).json({ error: "Unauthorized" }); return; }

    // 2. Find the pending match for this applicant & job
    const jobMatches = await rtdbQuery("matches", "job_id", jobId) || {};
    const matchEntry = Object.entries(jobMatches).find(([_, val]: any) => 
      val.user_id === applicantId && val.status === "pending"
    );

    if (!matchEntry) { res.status(404).json({ error: "Pending match not found" }); return; }

    const [matchId, matchVal] = matchEntry;
    
    // 3. Update match status based on direction
    const newStatus = direction === "like" ? "accepted" : "rejected";
    await rtdbUpdate(`matches/${matchId}`, { status: newStatus, updated_at: new Date().toISOString() });

    // 4. Return SwipeResponse
    res.json({
      success: true,
      matched: direction === "like",
      message: direction === "like" ? "It's a Match!" : "Applicant rejected"
    });

  } catch (error: any) {
    console.error("[employer swipe]", error);
    res.status(500).json({ error: "Failed to process swipe" });
  }
});

// GET /api/employer/talent
router.get("/employer/talent", async (req: Request, res: Response): Promise<void> => {
  const userId = requireAuth(req, res);
  if (!userId) return;

  try {
    // Get the set of users this employer has already swiped on
    const swipesMap = await rtdbQuery("employer_talent_swipes", "employerId", userId) || {};
    const swipedIds = new Set(Object.values(swipesMap).map((s: any) => s.applicantId));

    // Get ALL users
    const allUsersData = await rtdbGet("users") || {};
    const jobseekers = [];
    
    for (const [uid, userRecord] of Object.entries(allUsersData)) {
      const user = userRecord as any;
      // Only jobseekers, skip self, skip already-swiped
      if (user.role !== "jobseeker") continue;
      if (uid === userId) continue;
      if (swipedIds.has(uid)) continue;

      // Try to get their profile for extra detail (optional)
      const profile = await rtdbGet(`profiles/${uid}`);
      
      jobseekers.push({
        id: uid,
        applicantId: uid,
        name: profile?.name || user.name || "Jobseeker",
        email: profile?.email || user.email || "",
        avatar: profile?.avatar || "",
        bio: profile?.bio || "Available for opportunities.",
        skills: profile?.skills || [],
        location: profile?.location || "",
        resumeUrl: profile?.resumeUrl || "",
      });
    }
    
    console.log(`[talent] Found ${jobseekers.length} jobseekers for employer ${userId}`);
    res.json(jobseekers);
  } catch (error: any) {
    console.error("[get talent]", error);
    res.status(500).json({ error: "Failed to fetch talent pool" });
  }
});

// POST /api/employer/swipe-talent
router.post("/employer/swipe-talent", async (req: Request, res: Response): Promise<void> => {
  const userId = requireAuth(req, res);
  if (!userId) return;

  const { applicantId, direction } = req.body;
  if (!applicantId || !direction) { res.status(400).json({ error: "Missing fields" }); return; }

  try {
    const swipeObj = {
      employerId: userId,
      applicantId,
      direction,
      createdAt: new Date().toISOString()
    };
    await rtdbPush("employer_talent_swipes", swipeObj);
    
    res.json({
      success: true,
      message: direction === "like" ? "Candidate Saved!" : "Passed"
    });
  } catch (error: any) {
    console.error("[swipe talent]", error);
    res.status(500).json({ error: "Failed to swipe talent" });
  }
});

export default router;
