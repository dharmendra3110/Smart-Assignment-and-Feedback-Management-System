import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../config";
import { useNavigate } from "react-router-dom";

const StudentTestHistory = () => {
  const [history, setHistory] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/tests/history`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setHistory(res.data));
  }, []);

  return (
    <div className="dashboard-container">
      <button
        onClick={() => navigate("/student-dashboard")}
        className="logout-button"
        style={{ background: "#2196f3" }}
      >
        ⬅ Back to Dashboard
      </button>

      <h2>Your Test History</h2>

      {history.map((h) => (
        <div key={h._id} className="form-container">
          <h3>{h.testTitle}</h3>
          <p>
            Score: {h.score} / {h.totalMarks}
          </p>

          {/* ⭐ Leaderboard Button */}
          <button
            className="dashboard-button"
            style={{ marginTop: "10px" }}
            onClick={() => navigate(`/leaderboard/${h.testId}`)}
          >
            🏆 View Leaderboard
          </button>
        </div>
      ))}
    </div>
  );
};

export default StudentTestHistory;
