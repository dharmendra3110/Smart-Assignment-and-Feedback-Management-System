import express from "express";
import { auth } from "../middlewares/auth.js";
import { upload } from "../middlewares/upload.js";
import {
  createAssignment,
  listAssignments
} from "../controllers/assignmentController.js";

const router = express.Router();

router.post(
  "/",
  auth,
  upload.fields([
    { name: "questionsPDF", maxCount: 1 },
    { name: "markingSchemePDF", maxCount: 1 }
  ]),
  createAssignment
);

router.get("/", auth, listAssignments);

export default router;
