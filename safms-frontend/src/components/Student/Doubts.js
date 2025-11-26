import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../config";
import { useNavigate } from "react-router-dom";
const StudentDoubts = () => {
  const [doubts, setDoubts] = useState([]);
  const [text, setText] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const loadDoubts = () => {
    axios
      .get(`${BASE_URL}/api/doubts`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setDoubts(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadDoubts();
  }, []);

  const submitDoubt = () => {
    if (!text.trim()) return;
    axios
      .post(
        `${BASE_URL}/api/doubts`,
        { doubtText: text },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setText("");
        loadDoubts();
      });
  };

  return (
    <div className="dashboard-container">
        <button onClick={() => navigate("/student-dashboard")} className="logout-button" style={{ background: "#2196f3" }}>
        ⬅ Back to Dashboard
      </button>
      <h2>Doubts Forum</h2>

      <div className="form-container">
        <textarea
          placeholder="Ask your doubt..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>

        <button onClick={submitDoubt}>Post Doubt</button>
      </div>

      <h3 style={{ marginTop: 30 }}>All Doubts</h3>

      {doubts.map(d => (
        <div className="form-container" key={d._id} style={{ marginTop: 15 }}>
          <p>
            <strong>{d.askedByName}:</strong> {d.question}
          </p>

          {d.replies.length === 0 ? (
            <p style={{ opacity: 0.6 }}>No replies yet...</p>
          ) : (
            <>
              <strong>Replies:</strong>
              {d.replies.map((r, i) => (
                <p key={i} style={{ color: "#00e676" }}>
                  <strong>{r.repliedByName}:</strong> {r.replyText}
                </p>
              ))}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default StudentDoubts;
