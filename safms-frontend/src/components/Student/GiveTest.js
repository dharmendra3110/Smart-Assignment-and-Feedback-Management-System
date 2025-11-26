import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../config";
import { useNavigate } from "react-router-dom";

const GiveTest = () => {
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // ============================
  // FETCH ACTIVE TEST
  // ============================
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/tests/active`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("STUDENT RECEIVED:", res.data);
        setLoading(false);

        if (!res.data.active) {
          setTest(null);
          return;
        }

        const activeTest = res.data.test;
        setTest(activeTest);

        // --------------------------
        // FIXED TIMER INITIALIZATION
        // --------------------------
        const end = new Date(activeTest.endTime).getTime();
        const now = Date.now();
        const diff = Math.max(0, Math.floor((end - now) / 1000));

        setTimeLeft(diff);
      })
      .catch(() => {
        setLoading(false);
        setTest(null);
      });
  }, []);

  // ============================
  // TIMER COUNTDOWN
  // ============================
  useEffect(() => {
    if (timeLeft === null) return;

    if (timeLeft <= 0) {
      alert("⏳ Time is over! Auto-submitting your test.");
      submitTest();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  // ============================
  // SUBMIT TEST
  // ============================
  const submitTest = () => {
    axios
      .post(
        `${BASE_URL}/api/tests/submit`,
        { testId: test._id, answers },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        alert("Test submitted!");
        navigate("/student/test-history");
      })
      .catch((err) => {
        if (err.response?.data?.message === "You have already submitted this test.") {
          alert("You have already taken this test!");
        } else {
          alert("Submission failed.");
        }
      });
  };

  // ============================
  // UI DISPLAY
  // ============================
  if (loading) return <p style={{ color: "white" }}>Loading test...</p>;

  if (!test) {
    return (
      <div className="dashboard-container">
        <button
          onClick={() => navigate("/student-dashboard")}
          className="logout-button"
          style={{ background: "#2196f3" }}
        >
          ⬅ Back to Dashboard
        </button>
        <h2>No Active Test Right Now</h2>
        <p>Please check back later.</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h2>{test.title}</h2>

      {/* LIVE COUNTDOWN TIMER */}
      <h3 style={{ color: "#182098ff", marginBottom: "15px" }}>
        ⏳ Time Left: {formatTime(timeLeft)}
      </h3>

      <p>Duration: {test.duration} minutes</p>

      {test.questions.map((q, qi) => (
        <div className="form-container" key={qi}>
          <p>
            <strong>Q{qi + 1}:</strong> {q.text} ({q.marks} marks)
          </p>

          {q.options.map((op, oi) => (
            <div key={oi}>
              <input
                type="radio"
                name={`q-${qi}`}
                onChange={() => setAnswers({ ...answers, [qi]: oi })}
              />
              <label>{op}</label>
            </div>
          ))}
        </div>
      ))}

      <button
        onClick={submitTest}
        className="logout-button"
        style={{ marginTop: 20 }}
      >
        Submit Test
      </button>
    </div>
  );
};

export default GiveTest;
