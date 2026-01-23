import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import jobRoutes from "./routes/job.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import adminRoutes from "./routes/admin.routes.js";

// ================= ENV =================
dotenv.config();

// ================= DB =================
connectDB();

// ================= APP =================
const app = express();

// ===== ES Module __dirname FIX =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================= MIDDLEWARE =================

// CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://job-portal-app-ydon.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Postman / server calls

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= STATIC FILES =================
// 🔴 Resume access
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================= ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/admin", adminRoutes);

// ================= TEST =================
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

// ================= SERVER =================
const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  // Localhost ki jagah server ka status print karein
  console.log(`🚀 Server is live and listening on port ${PORT}`);
  console.log(`Environment Port: ${process.env.PORT || "Local 8080"}`);
});
