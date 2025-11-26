import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../config";
import { useNavigate } from "react-router-dom";

const SubmitAssignment = () => {
  const [assignments, setAssignments] = useState([]);
  const [assignmentId, setAssignmentId] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/assignments`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAssignments(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!assignmentId || !file) {
      setMessage("Please select assignment and upload file.");
      return;
    }

    const formData = new FormData();
    formData.append("assignmentId", assignmentId);
    formData.append("file", file);

    try {
      
      const res = await axios.post(`${BASE_URL}/api/submissions`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      }
    });

      setMessage("Assignment submitted successfully!");

    } catch (err) {
      setMessage("Submission failed.");
    }
  };

  return (
    <div className="form-container">
      <button onClick={() => navigate("/student-dashboard")} className="logout-button" style={{ background: "#2196f3" }}>
        ⬅ Back to Dashboard
      </button>
      <h2>📤 Submit Assignment</h2>

      <form onSubmit={handleSubmit}>
        <select value={assignmentId} onChange={(e) => setAssignmentId(e.target.value)} required>
          <option value="">Select Assignment</option>
          {assignments.map((a) => (
            <option key={a._id} value={a._id}>
              {a.title} — {a.subject}
            </option>
          ))}
        </select>

        <input type="file" onChange={(e) => setFile(e.target.files[0])} required />

        <button type="submit">Submit</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default SubmitAssignment;
