import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import FileStore from "session-file-store";
import router from "./routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Express = express();

const SESSION_SECRET = process.env.SESSION_SECRET || "behired-secret-key-change-in-production";

// Persist sessions to disk so they survive server restarts in development
const FileStoreSession = FileStore(session);
const sessionsDir = path.resolve(__dirname, "../.sessions");
if (!fs.existsSync(sessionsDir)) fs.mkdirSync(sessionsDir, { recursive: true });

app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(
  session({
    store: new FileStoreSession({ 
      path: sessionsDir, 
      ttl: 7 * 24 * 60 * 60, 
      retries: 0,
      reapInterval: -1,   // Disable reaper to avoid Windows EPERM rename errors
      logFn: () => {} 
    }),
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
