import mongoose from "mongoose";

const doubtSchema = new mongoose.Schema({
  askedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  askedByName: String,
  question: String,

  // Store all replies instead of only the latest one
  replies: [
    {
      replyText: String,
      repliedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      repliedByName: String,
      repliedAt: { type: Date, default: Date.now }
    }
  ],

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Doubt", doubtSchema);
