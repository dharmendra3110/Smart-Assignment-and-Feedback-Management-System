import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },         // question text
  options: { type: [String], required: true },    // options array
  correct: { type: Number, required: true },      // correct option index (0,1,2..)
  marks: { type: Number, required: true }         // marks for that question
});

const testSchema = new mongoose.Schema({
  title: String,
  duration: Number, // minutes
  questions: [questionSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  active: { type: Boolean, default: false },

  startTime: Date,   // when test starts
  endTime: Date      // when test ends = startTime + duration
});


export default mongoose.model("Test", testSchema);
