import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import profileRouter from "./profile.js";
import jobsRouter from "./jobs.js";
import swipesRouter from "./swipes.js";
import matchesRouter from "./matches.js";
import uploadRouter from "./upload.js";

import historyRouter from "./history.js";

import employerRouter from "./employer.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(profileRouter);
router.use(jobsRouter);
router.use(swipesRouter);
router.use(matchesRouter);
router.use(uploadRouter);
router.use(employerRouter);
router.use(historyRouter);

export default router;
