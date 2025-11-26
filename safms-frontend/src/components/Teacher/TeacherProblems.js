import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../config";
import { useNavigate } from "react-router-dom";
const TeacherProblems = () => {
  const [problems, setProblems] = useState([]);
  const [replyText, setReplyText] = useState({});
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const load = () => {
    axios.get(`${BASE_URL}/api/problems`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setProblems(res.data));
  };

  useEffect(() => { load(); }, []);

  const giveSolution = (problemId) => {
    axios.post(
      `${BASE_URL}/api/problems/solution/${problemId}`,
      { solutionText: replyText[problemId] },
      { headers: { Authorization: `Bearer ${token}` } }
    ).then(() => {
      setReplyText({ ...replyText, [problemId]: "" });
      load();
    });
  };

  return (
    <div className="dashboard-container">
        <button onClick={() => navigate("/teacher-dashboard")} className="logout-button" style={{ background: "#2196f3" }}>
        ⬅ Back to Dashboard
      </button>
      <h2>Problem Solutions</h2>

      {problems.map((p) => (
        <div className="form-container" key={p._id} style={{ marginTop: 20 }}>
          <p><strong>{p.askedByName}:</strong> {p.problemText}</p>

          <h4>Solutions:</h4>

          {p.solutions.map((s, i) => (
            <p key={i} style={{ color: "#00e676" }}>
              <strong>{s.teacherName}:</strong> {s.solutionText}
            </p>
          ))}

          {!p.solutions.find(s => s.teacherId === JSON.parse(atob(token.split('.')[1])).id) && (
            <>
              <textarea
                placeholder="Give your solution..."
                value={replyText[p._id] || ""}
                onChange={(e) => setReplyText({ ...replyText, [p._id]: e.target.value })}
              ></textarea>

              <button onClick={() => giveSolution(p._id)}>
                Submit Solution
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default TeacherProblems;
