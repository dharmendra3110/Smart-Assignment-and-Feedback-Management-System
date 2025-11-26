import mongoose from "mongoose";

const testSubmissionSchema = new mongoose.Schema(
  {
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: true
    },

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // Student-selected options (0,1,2,... indexes)
    answers: {
      type: [Number],
      required: true
    },

    score: { type: Number, default: 0 },
    totalMarks: { type: Number, default: 0 },

    submittedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model("TestSubmission", testSubmissionSchema);
