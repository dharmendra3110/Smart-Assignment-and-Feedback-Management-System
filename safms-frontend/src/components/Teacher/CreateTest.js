import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../config";
import { useNavigate } from "react-router-dom";

const CreateTest = () => {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [questions, setQuestions] = useState([
    { text: "", options: ["", "", "", ""], correct: 1, marks: 0 },
  ]);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // UPDATE QUESTION TEXT OR CORRECT ANSWER OR MARKS
  const updateQuestion = (i, field, value) => {
    const copy = [...questions];
    copy[i][field] = value;
    setQuestions(copy);
  };

  // UPDATE OPTIONS
  const updateOption = (qi, oi, value) => {
    const copy = [...questions];
    copy[qi].options[oi] = value;
    setQuestions(copy);
  };

  // ADD NEW QUESTION
  const addQuestion = () => {
    setQuestions([
      ...questions,
      { text: "", options: ["", "", "", ""], correct: 1, marks: 0 },
    ]);
  };

  const saveTest = () => {
    // VALIDATION: all fields must be filled
    for (let q of questions) {
      if (!q.text.trim()) return alert("Enter question text!");
      if (q.options.some(op => !op.trim())) return alert("All options required!");
      if (q.correct < 1 || q.correct > 4) return alert("Correct option must be 1-4");
      if (!q.marks) return alert("Enter marks!");
    }

    axios
      .post(
        `${BASE_URL}/api/tests`,
        {
          title,
          duration: Number(duration),
          questions
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        alert("Test saved!");
        navigate("/teacher-dashboard");
      })
      .catch(() => alert("Failed to save test"));
  };

  return (
    <div className="form-container">
      <button onClick={() => navigate("/teacher-dashboard")} className="logout-button" style={{ background: "#2196f3" }}>
        ⬅ Back to Dashboard
      </button>
      <h2>Create Test</h2>

      <input
        placeholder="Test Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="number"
        placeholder="Duration (minutes)"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
      />

      <h3>Questions</h3>

      {questions.map((q, qi) => (
        <div key={qi} className="form-container" style={{ marginTop: 20 }}>
          <input
            placeholder={`Question ${qi + 1}`}
            value={q.text}
            onChange={(e) => updateQuestion(qi, "text", e.target.value)}
          />

          <p>Options:</p>

          {q.options.map((op, oi) => (
            <input
              key={oi}
              placeholder={`Option ${oi + 1}`}
              value={op}
              onChange={(e) => updateOption(qi, oi, e.target.value)}
            />
          ))}

          <input
            type="number"
            placeholder="Correct Option (1-4)"
            value={q.correct}
            onChange={(e) => updateQuestion(qi, "correct", Number(e.target.value))}
          />

          <input
            type="number"
            placeholder="Marks"
            value={q.marks}
            onChange={(e) => updateQuestion(qi, "marks", Number(e.target.value))}
          />
        </div>
      ))}

      <button onClick={addQuestion} className="dashboard-button">
        + Add Question
      </button>

      <button
        onClick={saveTest}
        className="logout-button"
        style={{ marginTop: 20 }}
      >
        Save Test
      </button>
    </div>
  );
};

export default CreateTest;
