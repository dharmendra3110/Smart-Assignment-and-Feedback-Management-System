import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../config";
import { useNavigate } from "react-router-dom";
import "../../App.css";

const CreateAssignment = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    subject: ""
  });
  const [questions, setQuestions] = useState([
    { questionText: "", maxMarks: 0 }
  ]);
  const [questionsPDF, setQuestionsPDF] = useState(null);
  const [markingSchemePDF, setMarkingSchemePDF] = useState(null);
  const [message, setMessage] = useState("");
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    fetchAssignments();
  }, [token]);

  const fetchAssignments = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/assignments?teacher=true`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssignments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFormChange = e => setForm({...form, [e.target.name]: e.target.value});

  const handleQuestionChange = (i, key, value) => {
    const q = [...questions];
    q[i][key] = value;
    setQuestions(q);
  };

  const addQuestion = () => setQuestions([...questions, { questionText: "", maxMarks: 0 }]);
  const removeQuestion = (i) => setQuestions(questions.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("dueDate", form.dueDate);
      fd.append("subject", form.subject);
// filter out empty questions
const cleanedQuestions = questions.filter(q => 
  q.questionText.trim() !== "" && Number(q.maxMarks) > 0
);

fd.append("questions", JSON.stringify(cleanedQuestions));

      if (questionsPDF) fd.append("questionsPDF", questionsPDF);
      if (markingSchemePDF) fd.append("markingSchemePDF", markingSchemePDF);

      const res = await axios.post(`${BASE_URL}/api/assignments`, fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      setMessage("Assignment created!");
      setForm({ title: "", description: "", dueDate: "", subject: "" });
      setQuestions([{ questionText: "", maxMarks: 0 }]);
      setQuestionsPDF(null);
      setMarkingSchemePDF(null);
      fetchAssignments();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Create failed");
    }
  };

  return (
    <div className="dashboard-container">
      <button onClick={() => navigate("/teacher-dashboard")} className="logout-button" style={{ background: "#2196f3" }}>
        ⬅ Back to Dashboard
      </button>

      <div className="form-container">
        <h2>📘 Create Assignment</h2>
        <form onSubmit={handleSubmit}>
          <input name="title" placeholder="Title" value={form.title} onChange={handleFormChange} required/>
          <input name="subject" placeholder="Subject" value={form.subject} onChange={handleFormChange} required/>
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleFormChange} required/>
          <input name="dueDate" type="date" value={form.dueDate} onChange={handleFormChange} required />

          <h4>Questions (manual)</h4>
          {questions.map((q, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <input placeholder={`Q${i+1} text`} value={q.questionText} onChange={(e) => handleQuestionChange(i, "questionText", e.target.value)}/>
              <input placeholder="Max marks" type="number" value={q.maxMarks} onChange={(e) => handleQuestionChange(i, "maxMarks", Number(e.target.value))} style={{ width: 120, marginLeft: 8 }}/>
              {questions.length > 1 && <button type="button" onClick={() => removeQuestion(i)} style={{ marginLeft: 8 }}>Remove</button>}
            </div>
          ))}
          <button type="button" onClick={addQuestion}>+ Add Question</button>

          <div style={{ marginTop: 12 }}>
            <label>Questions PDF (optional)</label>
            <input type="file" accept=".pdf" onChange={(e) => setQuestionsPDF(e.target.files[0])} />
          </div>

          <div style={{ marginTop: 12 }}>
            <label>Marking Scheme PDF (optional)</label>
            <input type="file" accept=".pdf" onChange={(e) => setMarkingSchemePDF(e.target.files[0])} />
          </div>

          <button type="submit" style={{ marginTop: 12 }}>Create Assignment</button>
        </form>

        {message && <p style={{ color: "#00e676" }}>{message}</p>}
      </div>

      <div className="form-container" style={{ marginTop: 20 }}>
        <h3>📋 Your Assignments</h3>
        {assignments.map(a => (
          <div key={a._id} style={{ marginBottom: 12 }}>
            <strong>{a.title}</strong> — {a.subject} — due {new Date(a.dueDate).toLocaleDateString()}
            <div>
              {a.questions && a.questions.length > 0 && (
  <div style={{ marginTop: 8 }}>
    <h4 style={{ margin: 0 }}>Questions</h4>
    <ol>
      {a.questions.map((q, idx) => (
        <li key={idx}>
          {q.questionText} — <b>{q.maxMarks} marks</b>
        </li>
      ))}
    </ol>
  </div>
)}

              {a.questionsPDF && <a href={`${BASE_URL}/uploads/${a.questionsPDF}`} target="_blank" rel="noreferrer">Questions PDF</a>}
              {" "}
              {a.markingSchemePDF && <a href={`${BASE_URL}/uploads/${a.markingSchemePDF}`} target="_blank" rel="noreferrer">Marking Scheme</a>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreateAssignment;
