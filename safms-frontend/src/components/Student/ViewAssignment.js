import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../config";
import { useNavigate } from "react-router-dom";

const ViewAssignments = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState([]);
  const [mySubs, setMySubs] = useState([]); // student's submissions

  useEffect(() => {
    axios.get(`${BASE_URL}/api/assignments`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setAssignments(res.data))
      .catch(console.error);

    axios.get(`${BASE_URL}/api/submissions/student`, {
  headers: { Authorization: `Bearer ${token}` },
})

      .then(res => setMySubs(res.data))
      .catch(console.error);
  }, [token]);

  const findMySub = (assignmentId) => mySubs.find(s => s.assignmentId._id === assignmentId);

  return (
    <div className="dashboard-container">
      <button onClick={() => navigate("/student-dashboard")} className="logout-button" style={{ background: "#2196f3" }}>
        ⬅ Back to Dashboard
      </button>

      <div className="form-container">
        <h2>📚 Assignments</h2>
        {assignments.length === 0 && <p>No assignments yet.</p>}

        {assignments.map(a => {
          const mysub = findMySub(a._id);
          return (
            <div key={a._id} style={{ marginBottom: 18 }}>
              <h3>{a.title} — {a.subject}</h3>
              <p>{a.description}</p>
              <p><b>Due:</b> {new Date(a.dueDate).toLocaleDateString()}</p>

              {a.questions && a.questions.length > 0 && (
                <>
                  <h4>Questions</h4>
                  <ol>
                    {a.questions.map((q, idx) => (
                      <li key={idx}>
                        {q.questionText} — <b>{q.maxMarks} marks</b>
                      </li>
                    ))}
                  </ol>
                </>
              )}

              {a.questionsPDF && <p><a href={`${BASE_URL}/uploads/${a.questionsPDF}`} target="_blank" rel="noreferrer">📄 View Questions PDF</a></p>}
              {a.markingSchemePDF && <p><a href={`${BASE_URL}/uploads/${a.markingSchemePDF}`} target="_blank" rel="noreferrer">📄 View Marking Scheme</a></p>}

              {mysub ? (
                <div style={{ marginTop: 8 }}>
                  <p><b>Your submission:</b> <a href={`${BASE_URL}/uploads/${mysub.fileUrl}`} target="_blank" rel="noreferrer">view file</a></p>
                  {mysub.questionScores && mysub.questionScores.length > 0 ? (
                    <>
                      <h4>Marks</h4>
                      <ul>
                        {mysub.questionScores.map((qs, i) => (
                          <li key={i}>Q{qs.questionNumber}: {qs.scoredMarks}/{qs.maxMarks}</li>
                        ))}
                      </ul>
                      <p><b>Total:</b> {mysub.totalScore}</p>
                    </>
                  ) : (
                    <p><i>Not graded yet</i></p>
                  )}
                </div>
              ) : (
                <div style={{ marginTop: 8 }}>
                  <button onClick={() => navigate("/student/submit")}>Submit Assignment</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ViewAssignments;
