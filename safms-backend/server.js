import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import assignmentRoutes from "./routes/assignments.js";
import submissionRoutes from "./routes/submissions.js";
import doubtRoutes from "./routes/doubts.js";
import problemRoutes from "./routes/problems.js";
import testRoutes from "./routes/tests.js";

// Load environment variables FIRST
dotenv.config();

// Required for correct __dirname handling in ES modules (Windows safe)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files SAFELY and correctly
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// ---------------- MONGODB CONNECTION ----------------
console.log("⏳ Attempting MongoDB Connection...");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("🎉 MongoDB Connected Successfully!"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ---------------- ROUTES ----------------
app.get("/", (req, res) => res.send("SAFMS Backend Running ✅"));

app.use("/api/auth", authRoutes);           
app.use("/api/assignments", assignmentRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/doubts", doubtRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/tests", testRoutes);
// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 SAFMS backend running at http://localhost:${PORT}`)
);
