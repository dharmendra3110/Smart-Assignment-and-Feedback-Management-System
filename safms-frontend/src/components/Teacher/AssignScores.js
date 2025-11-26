import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../config";

const AssignScore = () => {
  const { submissionId: paramSubmissionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const [submissionId, setSubmissionId] = useState(paramSubmissionId || null);
  const [submission, setSubmission] = useState(null);
  const [scores, setScores] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isPDFType, setIsPDFType] = useState(false);
  const [feedback, setFeedback] = useState("");


  // If navigation used state instead of params, try that as fallback
  useEffect(() => {
    if (!submissionId && location.state && location.state.submissionId) {
      setSubmissionId(location.state.submissionId);
      console.log("[AssignScore] using location.state.submissionId:", location.state.submissionId);
    }
  }, [location.state, submissionId]);

  // MAIN fetch
  useEffect(() => {
    const fetchSubmission = async () => {
      setLoading(true);
      setError("");
      console.log("[AssignScore] submissionId:", submissionId);
      console.log("[AssignScore] token present:", !!token);

      if (!submissionId) {
        setError("No submission selected. (missing submissionId in URL or navigation state)");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${BASE_URL}/api/submissions/${submissionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("[AssignScore] API response:", res.status, res.data);
        const sub = res.data;

        if (!sub || !sub._id) {
          setError("Submission not found or API returned empty.");
          setLoading(false);
          return;
        }

        setSubmission(sub);
        console.log("SUBMISSION DEBUG:", submission);


        // if assignment has manual questions
        const assignmentQuestions = sub.assignmentId?.questions ?? [];
        if (Array.isArray(assignmentQuestions) && assignmentQuestions.length > 0) {
          setIsPDFType(false);
          setScores(
            assignmentQuestions.map((q) => ({
              question: q.questionText || "",
              maxMarks: q.maxMarks ?? "",
              obtainedMarks: ""
            }))
          );
        } else {
          // PDF type
          setIsPDFType(true);
          setScores([{ question: "", maxMarks: "", obtainedMarks: "" }]);
        }

        setLoading(false);
      } catch (err) {
        console.error("[AssignScore] fetch error:", err);
        // show helpful error
        if (err.response) {
          setError(`API error: ${err.response.status} ${err.response.data?.message || ""}`);
        } else {
          setError("Network or server error while fetching submission.");
        }
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [submissionId, token]);

  const updateScore = (i, key, val) => {
    setScores((prev) => {
      const copy = [...prev];
      copy[i] = { ...copy[i], [key]: val };
      return copy;
    });
  };

  const addPDFRow = () => {
    setScores((s) => [...s, { question: "", maxMarks: "", obtainedMarks: "" }]);
  };

  const saveScores = async () => {
  if (!submissionId) {
    setMessage("No submission selected — cannot save.");
    return;
  }

  // Validate numeric marks
  for (let i = 0; i < scores.length; i++) {
    const s = scores[i];

    if (s.obtainedMarks === "" || isNaN(Number(s.obtainedMarks))) {
      setMessage(`Please enter numeric marks for question ${i + 1}.`);
      return;
    }
  }

  try {
    const res = await axios.post(
      `${BASE_URL}/api/submissions/save-scores`,
      {
        submissionId,
        scores,
        feedback   // ⬅️ NEW FIELD ADDED HERE
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    console.log("[AssignScore] save response:", res.data);
    setMessage("Scores & feedback saved successfully!");
  } catch (err) {
    console.error("[AssignScore] save error:", err);
    setMessage("Failed to save scores.");
  }
};


  // Rendering
  if (loading) return <div className="dashboard-container"><p style={{ color: "white" }}>Loading...</p></div>;
  if (error) return (
    <div className="dashboard-container">
      <button className="logout-button" onClick={() => navigate("/teacher-dashboard")}>⬅ Back</button>
      <div className="form-container" style={{ marginTop: 20 }}>
        <p style={{ color: "#ffb4b4" }}><strong>Error:</strong> {error}</p>
        <p style={{ color: "#cbd5e1" }}>Check the browser console and Network tab for the request to <code>/api/submissions/{submissionId}</code>.</p>
      </div>
    </div>
  );

  if (!submission) {
    return <div className="dashboard-container"><p style={{ color: "white" }}>No submission loaded.</p></div>;
  }

  return (
    <div className="dashboard-container">
      <button onClick={() => navigate("/teacher-dashboard")} className="logout-button" style={{ background: "#2196f3" }}>
        ⬅ Back to Dashboard
      </button>
      <button className="logout-button" style={{ background: "#1e88e5" }} onClick={() => navigate("/teacher-dashboard")}>⬅ Back</button>

      <div className="form-container" style={{ marginTop: 25 }}>
        <h2>📝 Assign Scores</h2>

        <div style={{ marginBottom: 12 }}>
          <p><strong>Assignment:</strong> {submission.assignmentId?.title || "—"}</p>
          <p><strong>Subject:</strong> {submission.assignmentId?.subject || "—"}</p>
          <p><strong>Student:</strong> {submission.studentName || submission.studentId?.name || "—"}</p>
          <a
            href={`${BASE_URL}/uploads/${submission.fileUrl}`}
            target="_blank"
            rel="noreferrer"
            style={{ color: "#6dd5ed", fontWeight: 600 }}
          >
            View Submitted File
          </a>
        </div>

        <hr style={{ opacity: 0.15 }} />

        <h3 style={{ marginTop: 12 }}>Questions</h3>

        <div style={{ marginTop: 12 }}>
          {scores.map((q, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              {!isPDFType ? (
                <div>
                  <div style={{ color: "#dbeafe" }}><strong>Q{ i + 1 }:</strong> {q.question}</div>
                  <div style={{ color: "#93c5fd" }}>Max Marks: {q.maxMarks}</div>
                </div>
              ) : (
                <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <input className="input" placeholder="Question number" value={q.question} onChange={e => updateScore(i, "question", e.target.value)} style={{ width: 140 }} />
                  <input className="input" placeholder="Max marks" type="number" value={q.maxMarks} onChange={e => updateScore(i, "maxMarks", e.target.value)} style={{ width: 120 }} />
                </div>
              )}

              <div style={{ marginTop: 8 }}>
                <input className="input" placeholder="Marks obtained" type="number" value={q.obtainedMarks} onChange={e => updateScore(i, "obtainedMarks", e.target.value)} style={{ width: 180 }} />
              </div>
            </div>
          ))}

          {isPDFType && <button className="dashboard-button" onClick={addPDFRow} style={{ marginTop: 8 }}>➕ Add Question</button>}
          {/* ⭐ OPTIONAL FEEDBACK SECTION ⭐ */}
<h3 style={{ marginTop: 30 }}>Optional Feedback</h3>

<textarea
  placeholder="Write feedback for the student..."
  value={feedback}
  onChange={(e) => setFeedback(e.target.value)}
  style={{
    width: "100%",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    color: "white"
  }}
></textarea>

        </div>

        <button className="logout-button" style={{ background: "#00c853", marginTop: 16 }} onClick={saveScores}>💾 Save Scores</button>

        {message && <p style={{ marginTop: 12, color: "#00e676" }}>{message}</p>}
      </div>
    </div>
  );
};

export default AssignScore;
