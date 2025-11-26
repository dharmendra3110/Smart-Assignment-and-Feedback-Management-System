import Doubt from "../models/Doubt.js";
import User from "../models/User.js";

// ---------------------- GET ALL DOUBTS ----------------------
export const getDoubts = async (req, res) => {
  try {
    const doubts = await Doubt.find().sort({ createdAt: -1 });
    res.json(doubts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------------- POST A DOUBT ----------------------
export const postDoubt = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const doubt = new Doubt({
      askedBy: user._id,
      askedByName: user.name,
      question: req.body.doubtText,
      replies: []
    });

    await doubt.save();
    res.json({ message: "Doubt posted", doubt });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------------- REPLY TO A DOUBT ----------------------
export const replyToDoubt = async (req, res) => {
  try {
    const teacher = await User.findById(req.user.id);

    const replyObj = {
      replyText: req.body.reply,
      repliedBy: teacher._id,
      repliedByName: teacher.name,
      repliedAt: new Date()
    };

    const updated = await Doubt.findByIdAndUpdate(
      req.params.id,
      { $push: { replies: replyObj } },
      { new: true }
    );

    res.json({ message: "Reply added", updated });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
