import mongoose from "mongoose";

const problemSchema = new mongoose.Schema({
  askedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  askedByName: String,
  problemText: String,

  solutions: [
    {
      solutionText: String,
      teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      teacherName: String,
      solvedAt: { type: Date, default: Date.now }
    }
  ],

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Problem", problemSchema);
