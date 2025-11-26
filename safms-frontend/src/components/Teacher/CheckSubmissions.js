import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../config";
import { useNavigate } from "react-router-dom";

const CheckSubmissions = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [submissions, setSubmissions] = useState([]);
  const [grouped, setGrouped] = useState({});

  // Fetch submissions for THIS teacher
  useEffect(() => {
    const fetchSubs = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/submissions/teacher`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log("Teacher submissions:", res.data);
        setSubmissions(res.data);

        // Group by assignment
        const group = {};
        res.data.forEach(sub => {
          const aId = sub.assignmentId._id;
          if (!group[aId]) group[aId] = [];
          group[aId].push(sub);
        });

        setGrouped(group);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchSubs();
  }, [token]);

  return (
    <div className="dashboard-container">
      
      <button onClick={() => navigate("/teacher-dashboard")} className="logout-button" style={{ background: "#2196f3" }}>
        ⬅ Back to Dashboard
      </button>
      <h1>📂 Check Submissions</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "20px",
          marginTop: "20px"
        }}
      >
        {Object.keys(grouped).length === 0 && (
          <p>No submissions yet.</p>
        )}

        {Object.keys(grouped).map(aid => {
          const sample = grouped[aid][0].assignmentId;

          return (
            <div
              key={aid}
              className="form-container"
              style={{ minHeight: "130px" }}
            >
              <h2>{sample.title}</h2>
              <p><strong>Subject:</strong> {sample.subject}</p>
              <p><strong>Deadline:</strong> {new Date(sample.dueDate).toDateString()}</p>

              <h4>Submissions:</h4>
              {grouped[aid].map(s => (
                <div
                  key={s._id}
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid rgba(255,255,255,0.1)"
                  }}
                >
                  <p><strong>{s.studentName}</strong></p>

                  <a
                    href={`${BASE_URL}/uploads/submissions/${s.fileUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "#6dd5ed" }}
                  >
                    View Submission
                  </a>

                  <br />

                  {s.scores && s.scores.length > 0 ? (
  <button
    className="dashboard-button"
    disabled
    style={{
      background: "#555",
      cursor: "not-allowed",
      opacity: 0.6
    }}
  >
    ✔ Already Graded
  </button>
) : (
  <button
    className="dashboard-button"
    onClick={() => navigate(`/assign-score/${s._id}`)}
  >
    Assign Score
  </button>
)}

                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CheckSubmissions;
