import React from "react";
import { useNavigate } from "react-router-dom";
import "../../App.css";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>🎓 Student Dashboard</h1>
        <h3>Welcome, {user?.name}</h3>
      </div>

      <div className="dashboard-grid">

        <div className="dashboard-button" onClick={() => navigate("/student/view")}>
          📚 View Assignments
        </div>
        <p className="dashboard-info">
          Check all assignments uploaded by your teachers, including deadlines and instructions.
        </p>

        <div className="dashboard-button" onClick={() => navigate("/student/submit")}>
          📤 Submit Assignment
        </div>
        <p className="dashboard-info">
          Upload your completed assignment files for teacher evaluation.
        </p>

        <button className="dashboard-button" onClick={() => navigate("/view-scores")}>
          📊 View Scores
        </button>
        <p className="dashboard-info">
          View detailed marks, feedback, and performance breakdown for each assignment.
        </p>

        <div className="dashboard-button" onClick={() => navigate("/student-doubts")}>
          ❓ Doubt Submission
        </div>
        <p className="dashboard-info">
          Ask questions or doubts. Teachers can reply publicly so everyone can learn.
        </p>

        <div className="dashboard-button" onClick={() => navigate("/student/problems")}>
          Post Problems
        </div>
        <p className="dashboard-info">
          Post specific academic issues you’re facing. A teacher will give one final solution.
        </p>

        <button className="dashboard-button" onClick={() => navigate("/student/take-test")}>
          📝 Take Active Test
        </button>
        <p className="dashboard-info">
          Attempt the currently active test if a teacher has started one.
        </p>

        <button className="dashboard-button" onClick={() => navigate("/student/test-history")}>
          📊 My Test History
        </button>
        <p className="dashboard-info">
          Review all tests you have attempted along with your scores and performance.
        </p>
        <div
  className="dashboard-button"
  onClick={() => navigate("/student/analytics")}
>
  📊 Performance Analytics
</div>

      </div>
    </div>
  );
};

export default StudentDashboard;
