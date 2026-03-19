import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import router from "./routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Express = express();

const SESSION_SECRET = process.env.SESSION_SECRET || "behired-secret-key-change-in-production";

app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 },
  })
);

app.use("/api", router);

// Global error handler — catches any unhandled errors in routes
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[express error]", err);
  res.status(err.status ?? 500).json({ error: err.message ?? "Internal server error" });
});

// In production, serve the built React app from this same server
if (process.env.NODE_ENV === "production") {
  const frontendDist =
    process.env.FRONTEND_DIST || path.resolve(__dirname, "../dist/public");

  if (fs.existsSync(frontendDist)) {
    app.use(express.static(frontendDist));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(frontendDist, "index.html"));
    });
  }
}

export default app;
