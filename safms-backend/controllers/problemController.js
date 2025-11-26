import Problem from "../models/Problem.js";
import User from "../models/User.js";


// ➤ STUDENT POSTS A PROBLEM
export const postProblem = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const problem = new Problem({
      askedBy: req.user.id,
      askedByName: user.name,
      problemText: req.body.problemText
    });

    await problem.save();
    res.json(problem);
  } catch (err) {
    console.error("Post problem error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// ➤ GET ALL PROBLEMS (Visible to all students & teachers)
export const getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find().sort({ createdAt: -1 });
    res.json(problems);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


// ➤ TEACHER POSTS SOLUTION (ONLY ONE PER TEACHER)
export const postSolution = async (req, res) => {
  try {
    const teacher = await User.findById(req.user.id);

    const { problemId } = req.params;
    const { solutionText } = req.body;

    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    // Check if this teacher already answered
    const alreadyAnswered = problem.solutions.some(
      (s) => s.teacherId.toString() === req.user.id
    );

    if (alreadyAnswered) {
      return res.status(400).json({ message: "You already answered this problem" });
    }

    problem.solutions.push({
      solutionText,
      teacherId: req.user.id,
      teacherName: teacher.name
    });

    await problem.save();

    res.json({ message: "Solution added", problem });
  } catch (err) {
    console.error("Solution error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
