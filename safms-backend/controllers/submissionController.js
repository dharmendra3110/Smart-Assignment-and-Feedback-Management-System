import Submission from "../models/Submission.js";
import Assignment from "../models/Assignment.js";
import User from "../models/User.js";

// ---------------------- SUBMIT ASSIGNMENT ----------------------
export const submitAssignment = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    const { assignmentId } = req.body;

    if (!assignmentId) {
      return res.status(400).json({ message: "Assignment ID required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Submission file required" });
    }

    const student = await User.findById(req.user.id);
    const submission = new Submission({
      assignmentId,
      studentId: req.user.id,
      studentName: student.name,
      fileUrl: `/uploads/${req.file.filename}`,
      submittedAt: new Date()
    });

    await submission.save();
    res.json({ message: "Assignment submitted!", submission });
  } catch (err) {
    console.error("Submit error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------------- GET SUBMISSIONS FOR TEACHER ----------------------
export const getAllSubmissions = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const teacherAssignments = await Assignment.find({ createdBy: teacherId });
    const assignmentIds = teacherAssignments.map(a => a._id);

    const submissions = await Submission.find({
      assignmentId: { $in: assignmentIds }
    }).populate("assignmentId");

    res.json(submissions);
  } catch (err) {
    console.error("Submission fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------------- GRADE SUBMISSION ----------------------
export const gradeSubmission = async (req, res) => {
  try {
    const { marks } = req.body;

    await Submission.findByIdAndUpdate(req.params.id, {
      questionScores: marks,
      graded: true
    });

    res.json({ message: "Grades saved successfully!" });
  } catch (err) {
    console.error("Grade error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------------- SAVE SCORES (ASSIGN SCORE PAGE) ----------------------
export const saveScores = async (req, res) => {
  try {
    const { submissionId, scores, feedback } = req.body;

    if (!submissionId) {
      return res.status(400).json({ message: "Submission ID required" });
    }

    // VALIDATE SCORES
    for (let s of scores) {
      if (Number(s.obtainedMarks) > Number(s.maxMarks)) {
        return res.status(400).json({
          message: `Marks for question ${s.questionNumber} cannot exceed maximum (${s.maxMarks}).`
        });
      }
    }

    let totalScore = scores.reduce(
      (sum, q) => sum + Number(q.obtainedMarks),
      0
    );

    await Submission.findByIdAndUpdate(submissionId, {
      scores,
      totalScore,
      feedback: feedback || ""
    });

    res.json({ message: "Scores saved successfully!" });
  } catch (err) {
    console.error("Save Scores Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------------- GET SUBMISSION BY ID ----------------------
export const getSubmissionById = async (req, res) => {
  try {
    const sub = await Submission.findById(req.params.id)
      .populate("assignmentId")
      .populate("studentId");

    if (!sub) return res.status(404).json({ message: "Submission not found" });

    res.json(sub);
  } catch (err) {
    console.error("Fetch single submission error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------------- GET STUDENT SCORES ----------------------
export const getStudentScores = async (req, res) => {
  try {
    const list = await Submission.find({ studentId: req.user.id })
      .populate("assignmentId");

    res.json(list);
  } catch (err) {
    console.error("Score Fetch Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------------- FINAL EXPORT ----------------------
export default {
  submitAssignment,
  getAllSubmissions,
  gradeSubmission,
  saveScores,
  getSubmissionById,
  getStudentScores
};
