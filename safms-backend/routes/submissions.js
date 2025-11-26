import express from "express";
import { auth } from "../middlewares/auth.js";
import { upload } from "../middlewares/upload.js";

import {
  submitAssignment,
  getAllSubmissions,
  gradeSubmission,
  saveScores,
  getStudentScores
} from "../controllers/submissionController.js";
import { getSubmissionById } from "../controllers/submissionController.js";

const router = express.Router();

// Student → submit an assignment
router.post("/", auth, upload.single("file"), submitAssignment);

// Teacher → view all submissions
router.get("/teacher", auth, getAllSubmissions);

// Teacher → grade a submission
router.post("/grade/:id", auth, gradeSubmission);

// Teacher → save detailed scores
router.post("/save-scores", auth, saveScores);
router.get("/student", auth, getStudentScores);
router.get("/:id", auth, getSubmissionById);


export default router;
