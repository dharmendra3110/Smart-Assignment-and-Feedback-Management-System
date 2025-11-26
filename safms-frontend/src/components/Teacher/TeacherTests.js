import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../config";
import { useNavigate } from "react-router-dom";

const TeacherTests = () => {
  const [tests, setTests] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // ---------------------------
  // Load all tests created by teacher
  // ---------------------------
  const loadTests = () => {
    axios
      .get(`${BASE_URL}/api/tests/all`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => setTests(res.data))
      .catch((err) => console.error("Load tests error:", err));
  };

  useEffect(() => {
    loadTests();
  }, []);

  // 🔁 Live timer: refresh remaining time every 1s
  useEffect(() => {
    const interval = setInterval(() => {
      setTests((prev) => [...prev]); // trigger re-render every second
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ---------------------------
  // Activate test
  // ---------------------------
  const activateTest = async (id) => {
    try {
      await axios.post(
        `${BASE_URL}/api/tests/activate/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Test Activated Successfully!");
      loadTests();
    } catch (err) {
      console.error("Activation error:", err);
      alert("Failed to activate test");
    }
  };

  const deleteTest = (id) => {
    if (!window.confirm("Are you sure you want to delete this test?")) return;

    axios
      .delete(`${BASE_URL}/api/tests/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(() => {
        alert("Test deleted!");
        loadTests();
      })
      .catch(() => alert("Failed to delete test"));
  };

  const disableTest = (id) => {
    axios
      .post(
        `${BASE_URL}/api/tests/disable/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        alert("Test disabled!");
        loadTests();
      });
  };

  // ⏳ Format seconds to mm:ss
  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s < 10 ? "0" : ""}${s}s`;
  };

  return (
    <div className="dashboard-container">
      <button
        onClick={() => navigate("/teacher-dashboard")}
        className="logout-button"
        style={{ background: "#2196f3" }}
      >
        ⬅ Back to Dashboard
      </button>

      <h2>Your Tests</h2>

      {tests.length === 0 && <p>No tests created yet.</p>}

      {tests.map((t) => {
        let timeLeft = null;

        if (t.active && t.endTime) {
          const now = Date.now();
          const end = new Date(t.endTime).getTime();
          const diff = Math.floor((end - now) / 1000);
          timeLeft = diff > 0 ? diff : 0;
        }

        return (
          <div key={t._id} className="form-container" style={{ marginTop: 20 }}>
            <h3>{t.title}</h3>
            <p>
              <strong>Duration:</strong> {t.duration} mins
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {t.active ? "Active" : "Not Active"}
            </p>

            {/* 🕒 TIMER DISPLAY */}
            {t.active && (
              <p style={{ color: "#182098ff", fontSize: "18px", marginTop: "10px" }}>
                ⏳ Time Left:{" "}
                {timeLeft > 0 ? formatTime(timeLeft) : "❌ Time Over"}
              </p>
            )}

            {/* Activate Button */}
            {!t.active && (
              <button
                className="dashboard-button"
                style={{ marginTop: 10 }}
                onClick={() => activateTest(t._id)}
              >
                Activate Test
              </button>
            )}

            {/* Active Status */}
            {t.active && (
              <p style={{ color: "#00e676", marginTop: 10 }}>
                This test is currently active.
              </p>
            )}

            {/* Active / Ended / Not Active Label */}
            {t.active ? (
              <p style={{ color: "green" }}>🟢 Active</p>
            ) : t.endTime && new Date() > new Date(t.endTime) ? (
              <p style={{ color: "red" }}>🔴 Test Ended</p>
            ) : (
              <p>Not Active</p>
            )}

            {/* Disable Test */}
            <button
              className="logout-button"
              style={{ background: "gray" }}
              onClick={() => disableTest(t._id)}
            >
              Disable Test
            </button>

            {/* Delete Test */}
            <button
              className="logout-button"
              style={{ background: "#e63946", marginTop: 10 }}
              onClick={() => deleteTest(t._id)}
            >
              Delete Test
            </button>

            {/* Leaderboard */}
            <button
              className="dashboard-button"
              onClick={() => navigate(`/leaderboard/${t._id}`)}
            >
              🏆 View Leaderboard
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default TeacherTests;
