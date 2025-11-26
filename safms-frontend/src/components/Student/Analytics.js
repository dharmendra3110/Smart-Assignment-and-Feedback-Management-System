import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../config";
import { Line, Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement
);

const StudentAnalytics = () => {
  const [assignmentScores, setAssignmentScores] = useState([]);
  const [testScores, setTestScores] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/submissions/student`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => setAssignmentScores(res.data));

    axios
      .get(`${BASE_URL}/api/tests/history`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => setTestScores(res.data));
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

      <h2>📊 Performance Analytics</h2>

      {/* ===== Overall Stats ===== */}
      <div className="form-container" style={{ textAlign: "center" }}>
        <h3>Overall Summary</h3>
        <p><strong>Total Assignments:</strong> {assignmentScores.length}</p>
        <p><strong>Average Assignment Score:</strong> 
          {assignmentScores.length > 0
            ? (
                assignmentScores.reduce((a, b) => a + b.totalScore, 0) /
                assignmentScores.length
              ).toFixed(2)
            : 0}
        </p>

        <p><strong>Total Tests Attempted:</strong> {testScores.length}</p>
        <p><strong>Average Test Score:</strong>
          {testScores.length > 0
            ? (
                testScores.reduce((a, b) => a + b.score, 0) /
                testScores.length
              ).toFixed(2)
            : 0}
        </p>
      </div>

      {/* ===== Test Score Trend Line Chart ===== */}
      {testScores.length > 0 && (
        <div className="form-container" style={{ marginTop: 30 }}>
          <h3>📈 Test Score Trend</h3>
          <Line
            data={{
              labels: testScores.map((t) =>
                new Date(t.submittedAt).toLocaleDateString()
              ),
              datasets: [
                {
                  label: "Test Scores",
                  data: testScores.map((t) => t.score),
                  borderColor: "#2196f3",
                  tension: 0.4,
                },
              ],
            }}
          />
        </div>
      )}

      {/* ===== Assignment Score Bar Chart ===== */}
      {assignmentScores.length > 0 && (
        <div className="form-container" style={{ marginTop: 30 }}>
          <h3>📘 Assignment Score Comparison</h3>
          <Bar
            data={{
              labels: assignmentScores.map((a) => a.assignmentId.title),
              datasets: [
                {
                  label: "Scores",
                  data: assignmentScores.map((a) => a.totalScore),
                  backgroundColor: "#42a5f5",
                },
              ],
            }}
          />
        </div>
      )}
    </div>
  );
};

export default StudentAnalytics;
