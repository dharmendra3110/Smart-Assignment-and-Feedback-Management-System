import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../config";
import { useNavigate } from "react-router-dom";
const StudentProblems = () => {
  const [problems, setProblems] = useState([]);
  const [text, setText] = useState("");
  const token = localStorage.getItem("token");
const navigate = useNavigate();
  const load = () => {
    axios.get(`${BASE_URL}/api/problems`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setProblems(res.data));
  };

  useEffect(() => { load(); }, []);

  const postProblem = () => {
    axios.post(`${BASE_URL}/api/problems`,
      { problemText: text },
      { headers: { Authorization: `Bearer ${token}` } }
    ).then(() => {
      setText("");
      load();
    });
  };

  return (
    <div className="dashboard-container">
        <button onClick={() => navigate("/student-dashboard")} className="logout-button" style={{ background: "#2196f3" }}>
        ⬅ Back to Dashboard
      </button>
      <h2>Problems Forum</h2>

      <div className="form-container">
        <textarea
          placeholder="Describe your problem..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>

        <button onClick={postProblem}>Post Problem</button>
      </div>

      <h3 style={{ marginTop: 30 }}>All Problems</h3>

      {problems.map((p) => (
        <div className="form-container" key={p._id} style={{ marginTop: 15 }}>
          <p><strong>{p.askedByName}:</strong> {p.problemText}</p>

          <h4>Solutions</h4>
          {p.solutions.length === 0 ? (
            <p style={{ opacity: 0.6 }}>No solutions yet.</p>
          ) : (
            p.solutions.map((s, i) => (
              <p key={i} style={{ color: "#00e676" }}>
                <strong>{s.teacherName}:</strong> {s.solutionText}
              </p>
            ))
          )}
        </div>
      ))}
    </div>
  );
};

export default StudentProblems;
