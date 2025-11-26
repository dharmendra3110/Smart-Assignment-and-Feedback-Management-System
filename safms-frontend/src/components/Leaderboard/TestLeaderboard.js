import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../config";
import { useParams } from "react-router-dom";

const TestLeaderboard = () => {
  const { testId } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/tests/leaderboard/${testId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [testId]);

  if (loading) return <h2 className="dashboard-header">Loading Leaderboard...</h2>;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-header">🏆 Test Leaderboard</h1>

      <div className="form-container" style={{ maxWidth: 700 }}>
        {data.length === 0 ? (
          <h3>No submissions yet.</h3>
        ) : (
          <table style={{ width: "100%", color: "black" }}>
            <thead>
              <tr style={{ fontWeight: "bold" }}>
                <td>Rank</td>
                <td>Student</td>
                <td>Score</td>
                <td>Total</td>
              </tr>
            </thead>

            <tbody>
              {data.map((entry) => (
                <tr key={entry.rank}>
                  <td>{entry.rank}</td>
                  <td>{entry.studentName}</td>
                  <td>{entry.score}</td>
                  <td>{entry.totalMarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TestLeaderboard;
