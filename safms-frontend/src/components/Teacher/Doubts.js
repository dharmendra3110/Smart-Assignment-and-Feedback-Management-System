import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../config";
import { useNavigate } from "react-router-dom";

const TeacherDoubts = () => {
  const [doubts, setDoubts] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [replyFor, setReplyFor] = useState(null);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const loadDoubts = () => {
    axios
      .get(`${BASE_URL}/api/doubts`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setDoubts(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadDoubts();
  }, []);

  const sendReply = (doubtId) => {
    if (!replyText.trim()) return;

    axios
      .post(
        `${BASE_URL}/api/doubts/reply/${doubtId}`,
        { reply: replyText },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setReplyText("");
        setReplyFor(null);
        loadDoubts();
      })
      .catch((e) => console.error(e));
  };

  return (
    <div className="dashboard-container">
        <button onClick={() => navigate("/teacher-dashboard")} className="logout-button" style={{ background: "#2196f3" }}>
        ⬅ Back to Dashboard
      </button>
      <h2>Doubt Clearance</h2>

      {doubts.map((d) => (
        <div className="form-container" key={d._id} style={{ marginTop: 20 }}>
          <p>
            <strong>{d.askedByName}:</strong> {d.question}
          </p>

          {/* show ALL replies */}
          {d.replies.length > 0 && (
            <>
              <strong>Replies:</strong>
              {d.replies.map((r, i) => (
                <p key={i} style={{ color: "#00e676" }}>
                  <strong>{r.repliedByName}:</strong> {r.replyText}
                </p>
              ))}
            </>
          )}

          {/* reply box */}
          {replyFor === d._id ? (
            <>
              <textarea
                placeholder="Write reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              ></textarea>

              <button onClick={() => sendReply(d._id)}>Send Reply</button>
              <button
                style={{ marginLeft: 10 }}
                onClick={() => {
                  setReplyFor(null);
                  setReplyText("");
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <button onClick={() => setReplyFor(d._id)}>Reply</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default TeacherDoubts;
