import Test from "../models/Test.js";
import TestSubmission from "../models/TestAttempt.js";

// ---------------- CREATE TEST ----------------
export const createTest = async (req, res) => {
  try {
    const { title, duration, questions } = req.body;

    const formattedQuestions = questions.map(q => ({
      text: q.text || q.question || q.questionText || "Untitled Question",
      options: q.options || ["","","",""],
      correct: Number(q.correct) - 1,
      marks: Number(q.marks) || 0
    }));

    const test = new Test({
      title: title || "Untitled Test",
      duration: Number(duration) || 1,  // default 1 minute
      questions: formattedQuestions,
      createdBy: req.user.id,
      active: false
    });

    await test.save();
    res.json({ message: "Test created successfully", test });
  } catch (err) {
    console.error("Create Test Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- GET TEACHER TESTS ----------------
export const getAllTests = async (req, res) => {
  try {
    const tests = await Test.find({ createdBy: req.user.id });
    res.json(tests);
  } catch (err) {
    console.error("Get Tests Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- ACTIVATE TEST ----------------
export const activateTest = async (req, res) => {
  try {
    const { id } = req.params;

    // Deactivate any existing test
    await Test.updateMany({}, { $set: { active: false } });

    const test = await Test.findById(id);
    if (!test) return res.status(404).json({ message: "Test not found" });

    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + test.duration * 60000);

    test.active = true;
    test.startTime = startTime;
    test.endTime = endTime;

    await test.save();

    res.json({
      message: "Test activated successfully",
      active: true,
      test
    });

  } catch (err) {
    console.error("Activate Test Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- GET ACTIVE TEST FOR STUDENT ----------------
export const getActiveTest = async (req, res) => {
  try {
    const test = await Test.findOne({ active: true });

    if (!test) {
      return res.json({ active: false, test: null });
    }

    const now = new Date();

    if (test.endTime && now > test.endTime) {
      test.active = false;
      await test.save();
      return res.json({ active: false, test: null });
    }
console.log("🔍 ACTIVE TEST SENT TO STUDENT:", {
  title: test.title,
  duration: test.duration,
  questions: test.questions
});

    return res.json({
      active: true,
      test: {
        _id: test._id,
        title: test.title,
        duration: test.duration,
        startTime: test.startTime,
        endTime: test.endTime,
        questions: test.questions.map(q => ({
          text: q.text,
          options: q.options,
          correct: q.correct,
          marks: q.marks
        }))
      }
    });

  } catch (err) {
    console.error("Get Active Test Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- SUBMIT TEST ----------------
// ---------------- SUBMIT TEST ----------------
export const submitTest = async (req, res) => {
  try {
    const { testId, answers } = req.body;

    // CHECK IF STUDENT ALREADY SUBMITTED THIS TEST
    const alreadySubmitted = await TestSubmission.findOne({
      testId,
      studentId: req.user.id
    });

    if (alreadySubmitted) {
      return res.status(400).json({
        message: "You have already submitted this test."
      });
    }

    const test = await Test.findById(testId);
    if (!test) return res.status(404).json({ message: "Test not found" });

    let score = 0;
    let totalMarks = 0;

    test.questions.forEach((q, index) => {
      totalMarks += Number(q.marks);
      if (answers[index] === q.correct) {
        score += Number(q.marks);
      }
    });

    const answerArray = Array.isArray(answers)
      ? answers
      : Object.keys(answers).map((k) => Number(answers[k]));

    const submission = new TestSubmission({
      testId,
      studentId: req.user.id,
      answers: answerArray,
      score,
      totalMarks
    });

    await submission.save();

    res.json({
      message: "Test submitted successfully",
      score,
      totalMarks
    });
  } catch (err) {
    console.error("Submit Test Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// ---------------- TEST HISTORY ----------------
// ---------------- GET STUDENT TEST HISTORY ----------------
export const getHistory = async (req, res) => {
  try {
    const submissions = await TestSubmission.find({
      studentId: req.user.id
    }).populate("testId");

    const formatted = submissions.map(s => ({
      _id: s._id,
      testId: s.testId?._id || null,   // prevent crashes
      testTitle: s.testId?.title || "Unknown Test",
      score: s.score,
      totalMarks: s.totalMarks,
      submittedAt: s.submittedAt
    }));

    res.json(formatted);
  } catch (err) {
    console.error("History Fetch Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- DELETE TEST ----------------
export const deleteTest = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Test.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Test not found" });
    }

    res.json({ message: "Test deleted successfully" });
  } catch (err) {
    console.error("Delete Test Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- DISABLE TEST ----------------
export const disableTest = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Test.findByIdAndUpdate(
      id,
      { active: false },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Test not found" });
    }

    res.json({ message: "Test disabled successfully", test: updated });
  } catch (err) {
    console.error("Disable Test Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- GET LEADERBOARD FOR A TEST ----------------
export const getLeaderboard = async (req, res) => {
  try {
    const { testId } = req.params;

    // Get all submissions for that test
    const submissions = await TestSubmission.find({ testId })
      .populate("studentId", "name")
      .sort({ score: -1, submittedAt: 1 }); // ranking logic

    const leaderboard = submissions.map((s, index) => ({
      rank: index + 1,
      studentName: s.studentId.name,
      score: s.score,
      totalMarks: s.totalMarks,
      submittedAt: s.submittedAt,
    }));

    res.json(leaderboard);
  } catch (err) {
    console.error("Leaderboard Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
