import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  maxMarks: { type: Number, required: true }
});

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  dueDate: { type: Date, required: true },
  subject: { type: String, required: true },
  teacherName: { type: String, required: true },

  // Option C
  questionsPDF: { type: String },        // filename
  markingSchemePDF: { type: String },    // filename

  // Manually added questions
  questions: [questionSchema],

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

export default mongoose.model("Assignment", assignmentSchema);
