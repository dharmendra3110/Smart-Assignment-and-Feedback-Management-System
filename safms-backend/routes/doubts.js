import express from "express";
import { auth } from "../middlewares/auth.js";
import {
  postDoubt,
  replyToDoubt,
  getDoubts
} from "../controllers/doubtController.js";

const router = express.Router();

router.post("/", auth, postDoubt);
router.get("/", auth, getDoubts);
router.post("/reply/:id", auth, replyToDoubt);

export default router;
