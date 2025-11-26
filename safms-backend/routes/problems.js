import express from "express";
import { auth } from "../middlewares/auth.js";
import { postProblem, getAllProblems, postSolution } from "../controllers/problemController.js";

const router = express.Router();

// Student posts a problem
router.post("/", auth, postProblem);

// Everyone can view problems
router.get("/", auth, getAllProblems);

// Teacher posts a solution
router.post("/solution/:problemId", auth, postSolution);

export default router;
