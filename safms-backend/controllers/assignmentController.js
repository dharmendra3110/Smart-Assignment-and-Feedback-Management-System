import Assignment from "../models/Assignment.js";
import User from "../models/User.js";

export const createAssignment = async (req, res) => {
  try {
    const { title, description, dueDate, subject, questions } = req.body;

    if (!title || !description || !dueDate || !subject) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const teacher = await User.findById(req.user.id);
    if (!teacher) {
      return res.status(400).json({ message: "Teacher not found" });
    }

    let parsedQuestions = [];
    if (questions) {
      try {
        parsedQuestions = JSON.parse(questions);
      } catch (err) {
        return res.status(400).json({ message: "Invalid questions JSON" });
      }
    }

    const assignment = new Assignment({
      title,
      description,
      dueDate,
      subject,
      teacherName: teacher.name,
      createdBy: req.user.id,
      questions: parsedQuestions,
      questionsPDF: req.files?.questionsPDF?.[0]?.filename || null,
      markingSchemePDF: req.files?.markingSchemePDF?.[0]?.filename || null
    });

    await assignment.save();

    res.json({ message: "Assignment created successfully!", assignment });
  } catch (err) {
    console.error("Assignment create error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const listAssignments = async (req, res) => {
  try {
    console.log("listAssignments HIT"); 
    console.log("Assignments request by:", req.user);
    // Only return teacher's assignments if query says teacher=true
    if (req.query.teacher === "true") {
      const assignments = await Assignment.find({ createdBy: req.user.id })
        .sort({ dueDate: 1 });
      return res.json(assignments);
    }


    // Otherwise list all for student
    const assignments = await Assignment.find()
      .sort({ dueDate: 1 });
    console.log(assignments); 

    res.json(assignments);
  } catch (err) {
    console.error("List error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
