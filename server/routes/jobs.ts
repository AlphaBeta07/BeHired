import { Router, type IRouter, type Request, type Response } from "express";
import { rtdbGet, rtdbSet, rtdbPush, rtdbQuery } from "../lib/firebaseAdmin.js";
import { CreateJobBody } from "../schemas.js";

const router: IRouter = Router();

function requireAuth(req: Request, res: Response): string | null {
  const userId = (req.session as any).userId;
  if (!userId) { res.status(401).json({ error: "Not authenticated" }); return null; }
  return userId;
}

router.get("/jobs", async (req: Request, res: Response): Promise<void> => {
  const userId = (req.session as any).userId;
  const { type, limit } = req.query;
  const limitNum = Number(limit) || 20;

  try {
    const jobsData = await rtdbGet("jobs");
    let jobs: any[] = jobsData ? Object.entries(jobsData).map(([id, val]: any) => ({ id, ...val })) : [];

    // Filter by type if specified
    if (type && type !== "all") {
      jobs = jobs.filter(j => j.type === type);
    }

    // Sort by creation date descending
    jobs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    jobs = jobs.slice(0, limitNum);

    // Filter out already-swiped jobs for logged-in users
    if (userId) {
      const swipesData = await rtdbQuery("swipes", "user_id", userId);
      const swipedIds = new Set(Object.values(swipesData).map((s: any) => s.job_id));
      jobs = jobs.filter(j => !swipedIds.has(j.id));
    }

    res.json(jobs);
  } catch (error: any) {
    console.error("[get jobs]", error.message);
    res.status(500).json({ error: error.message });
  }
});

router.get("/jobs/my", async (req: Request, res: Response): Promise<void> => {
  const userId = requireAuth(req, res);
  if (!userId) return;

  try {
    const myJobsData = await rtdbQuery("jobs", "employer_id", userId);
    const jobs = myJobsData ? Object.entries(myJobsData).map(([id, val]: any) => ({ id, ...val })) : [];
    jobs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json(jobs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/jobs", async (req: Request, res: Response): Promise<void> => {
  const userId = requireAuth(req, res);
  if (!userId) return;
  if ((req.session as any).userRole !== "employer") {
    res.status(403).json({ error: "Only employers can post jobs" }); return;
  }

  const parsed = CreateJobBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const d = parsed.data;
  try {
    const newJob = {
      title: d.title,
      company: d.company,
      company_logo: d.companyLogo ?? null,
      location: d.location,
      type: d.type,
      salary: d.salary ?? null,
      description: d.description,
      requirements: d.requirements ?? [],
      tags: d.tags ?? [],
      employer_id: userId,
      remote: d.remote ?? false,
      createdAt: new Date().toISOString(),
    };

    const jobId = await rtdbPush("jobs", newJob);
    await rtdbSet(`jobs/${jobId}/id`, jobId); // store own id for easy lookup
    res.status(201).json({ id: jobId, ...newJob });
  } catch (error: any) {
    console.error("[post job]", error.message);
    res.status(500).json({ error: "Failed to create job" });
  }
});

router.get("/jobs/:id", async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const job = await rtdbGet(`jobs/${id}`);
    if (!job) { res.status(404).json({ error: "Job not found" }); return; }
    res.json({ id, ...job });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
