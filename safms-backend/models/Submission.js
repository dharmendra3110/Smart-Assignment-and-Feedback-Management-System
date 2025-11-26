import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment" },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  file: String,

  // ⭐ WHEN STUDENT SUBMITTED ASSIGNMENT
  submittedAt: { type: Date, default: Date.now },

  // ⭐ MARKS FOR EACH QUESTION
  scores: [
    {
      questionNumber: Number,
      maxMarks: Number,
      obtainedMarks: Number
    }
  ],

  // ⭐ TOTAL SCORE
  totalScore: { type: Number, default: 0 },

  // ⭐ OPTIONAL FEEDBACK
  feedback: { type: String, default: "" },

  // ⭐ WHEN TEACHER GRADED IT
  gradedAt: { type: Date }
});

export default mongoose.model("Submission", submissionSchema);
