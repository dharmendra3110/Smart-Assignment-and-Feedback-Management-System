import React from "react";
import { useNavigate } from "react-router-dom";
import "../../App.css";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>🧑‍🏫 Teacher Dashboard</h1>
        <h3>Welcome, {user?.name}</h3>
      </div>

      <div className="dashboard-grid">

        <div className="dashboard-button" onClick={() => navigate("/teacher/create")}>
          📘 Create Assignment
        </div>
        <p className="dashboard-info">
          Add new assignments for your students, including instructions and questions.
        </p>

        <div
          className="dashboard-button"
          onClick={() => navigate("/teacher/check-submissions")}
        >
          📥 Check Submissions
        </div>
        <p className="dashboard-info">
          Review uploaded student assignments, assign scores, and provide feedback.
        </p>

        <div className="dashboard-button" onClick={() => navigate("/teacher-doubts")}>
          💬 Doubt Clearance
        </div>
        <p className="dashboard-info">
          View and respond to doubts posted by students in the doubt forum.
        </p>

        <div className="dashboard-button" onClick={() => navigate("/teacher/problems")}>
          🛠 Solve Problems
        </div>
        <p className="dashboard-info">
          Students can post academic problems. Provide one final solution to each.
        </p>

        <button
          className="dashboard-button"
          onClick={() => navigate("/teacher/create-test")}
        >
          ➕ Create Test
        </button>
        <p className="dashboard-info">
          Create a quiz-style test with MCQs, marks, and duration.
        </p>

        <button
          className="dashboard-button"
          onClick={() => navigate("/teacher/tests")}
        >
          🗂 My Tests
        </button>
        <p className="dashboard-info">
          View all your created tests, activate or deactivate them anytime.
        </p>

      </div>
    </div>
  );
};

export default TeacherDashboard;
