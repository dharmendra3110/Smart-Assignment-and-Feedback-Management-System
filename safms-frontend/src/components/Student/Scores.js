import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../config";
import { useNavigate } from "react-router-dom";
const ViewScores = () => {
  const [scores, setScores] = useState([]);
  const token = localStorage.getItem("token");
const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/submissions/student`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setScores(res.data))
      .catch((err) => console.error("Scores fetch error:", err));
  }, [token]);

  return (
    <div className="dashboard-container">
      <button onClick={() => navigate("/student-dashboard")} className="logout-button" style={{ background: "#2196f3" }}>
        ⬅ Back to Dashboard
      </button>
      <h2>Your Scores</h2>

      {scores.length === 0 && (
        <p style={{ color: "white" }}>No scores assigned yet.</p>
      )}

      {scores.map((s) => (
        <div
          className="form-container"
          key={s._id}
          style={{
            marginBottom: 25,
            animation: "fadeIn 0.5s ease-in-out",
          }}
        >
          <h3>{s.assignmentId?.title}</h3>
          <p>
            <strong>Subject:</strong> {s.assignmentId?.subject}
          </p>

          <p>
            <strong>Total Score:</strong>{" "}
            {s.totalScore !== undefined ? s.totalScore : "Not graded yet"}
          </p>
          {s.feedback && (
  <p style={{ marginTop: 10, color: "#ffd54f" }}>
    <strong>Teacher Feedback:</strong> {s.feedback}
  </p>
)}

          {/* question wise breakdown */}
          {s.scores && s.scores.length > 0 && (
            <>
              <h4>Breakdown</h4>

              {s.scores.map((q, idx) => (
                <p key={idx}>
                  <strong>Q{idx + 1}: </strong>
                  {q.obtainedMarks}/{q.maxMarks}
                </p>
              ))}
            </>
          )}

          {/* View submission file */}
          {s.fileUrl && (
            <a
              href={`${BASE_URL}/uploads/submissions/${s.fileUrl}`}
              target="_blank"
              rel="noreferrer"
              style={{ color: "#6dd5ed" }}
            >
              📄 View Your Submitted File
            </a>
          )}
        </div>
      ))}
    </div>
  );
};

export default ViewScores;
