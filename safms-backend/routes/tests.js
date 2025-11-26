import express from "express";
import { auth } from "../middlewares/auth.js";

import {
  createTest,
  getAllTests,
  activateTest,
  getActiveTest,
  submitTest,
  getHistory,
  deleteTest, disableTest,
  getLeaderboard
} from "../controllers/testController.js";

const router = express.Router();

// ---------------- TEACHER ROUTES ----------------

// Create test
router.post("/", auth, createTest);

// Get all tests created by the teacher
router.get("/all", auth, getAllTests);

// Activate a test (deactivates others automatically)
router.post("/activate/:id", auth, activateTest);

// Delete Test
router.delete("/delete/:id", auth, deleteTest);

// Disable Test
router.post("/disable/:id", auth, disableTest);

// ---------------- STUDENT ROUTES ----------------

// Fetch the currently active test
router.get("/active", auth, getActiveTest);

// Submit test responses
router.post("/submit", auth, submitTest);

// Get student's test history
router.get("/history", auth, getHistory);

router.get("/leaderboard/:testId", auth, getLeaderboard);

export default router;
