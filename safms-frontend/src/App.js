import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import CheckSubmissions from "./components/Teacher/CheckSubmissions";
import SubmitAssignment from "./components/Student/SubmitAssignment";
import AssignScores from "./components/Teacher/AssignScores";
import ViewScores from "./components/Student/Scores";
import StudentDoubts from "./components/Student/Doubts";
import DoubtClearance from "./components/Teacher/Doubts";
import StudentProblems from "./components/Student/StudentProblems";
import TeacherProblems from "./components/Teacher/TeacherProblems";
// App.js (front)
import CreateTest from "./components/Teacher/CreateTest";
import TeacherTests from "./components/Teacher/TeacherTests"; // optional: list/activate tests
import GiveTest from "./components/Student/GiveTest";
import StudentTestHistory from "./components/Student/TestHistory"; // optional

import TestLeaderboard from "./components/Leaderboard/TestLeaderboard";

import StudentAnalytics from "./components/Student/Analytics";
// Auth
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";

// Utility
import ProtectedRoute from "./utils/ProtectedRoute";

// Teacher
import TeacherDashboard from "./components/Teacher/TeacherDashboard";
import CreateAssignment from "./components/Teacher/CreateAssignment";

// Student
import StudentDashboard from "./components/Student/StudentDashboard";
import ViewAssignments from "./components/Student/ViewAssignment";


function App() {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Teacher Routes */}
        <Route
          path="/teacher-dashboard"
          element={
            <ProtectedRoute allowedRole="Teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/create"
          element={
            <ProtectedRoute allowedRole="Teacher">
              <CreateAssignment />
            </ProtectedRoute>
          }
        />
        <Route
  path="/teacher/check-submissions"
  element={
    <ProtectedRoute allowedRole="Teacher">
      <CheckSubmissions />
    </ProtectedRoute>
  }
/>

<Route
  path="/assign-score/:submissionId"
  element={
    <ProtectedRoute allowedRole="Teacher">
      <AssignScores />
    </ProtectedRoute>
  }
/>
<Route path="/leaderboard/:testId" element={<TestLeaderboard />} />

{/* Teacher test pages */}
<Route
  path="/teacher/create-test"
  element={
    <ProtectedRoute allowedRole="Teacher">
      <CreateTest />
    </ProtectedRoute>
  }
/>
<Route path="/student/analytics" element={<StudentAnalytics />} />


<Route
  path="/teacher/tests"
  element={
    <ProtectedRoute allowedRole="Teacher">
      <TeacherTests />
    </ProtectedRoute>
  }
/>

{/* Student test pages */}
<Route
  path="/student/take-test"
  element={
    <ProtectedRoute allowedRole="Student">
      <GiveTest />
    </ProtectedRoute>
  }
/>


<Route
  path="/student/test-history"
  element={
    <ProtectedRoute allowedRole="Student">
      <StudentTestHistory />
    </ProtectedRoute>
  }
/>


{/* Teacher Doubt Clearance Page */}
<Route
  path="/teacher-doubts"
  element={
    <ProtectedRoute allowedRole="Teacher">
      <DoubtClearance />
    </ProtectedRoute>
  }
/>
<Route path="/student/problems" element={
  <ProtectedRoute allowedRole="student">
    <StudentProblems />
  </ProtectedRoute>
} />

<Route path="/teacher/problems" element={
  <ProtectedRoute allowedRole="teacher">
    <TeacherProblems />
  </ProtectedRoute>
} />


        {/* Student Routes */}
        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute allowedRole="Student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
  path="/student/submit"
  element={
    <ProtectedRoute allowedRole="Student">
      <SubmitAssignment />
    </ProtectedRoute>
  }
/>

        <Route
  path="/student/view"
  element={
    <ProtectedRoute allowedRole="Student">
      <ViewAssignments />
    </ProtectedRoute>
  }
/>
<Route
  path="/view-scores"
  element={
    <ProtectedRoute allowedRole="Student">
      <ViewScores />
    </ProtectedRoute>
  }
/>
{/* Student Doubts Page */}
<Route
  path="/student-doubts"
  element={
    <ProtectedRoute allowedRole="Student">
      <StudentDoubts/>
    </ProtectedRoute>
  }
/>

      </Routes>
    </Router>
  );
}

export default App;

/* ==============================
   🌐 NAVIGATION BAR COMPONENT
   ============================== */
const NavigationBar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Logged out navbar
  if (!token || !user) {
    return (
      <nav style={styles.nav}>
        <div>
          <Link to="/register" style={styles.link}>Register</Link>
          <Link to="/login" style={styles.link}>Login</Link>
        </div>
      </nav>
    );
  }

  // Logged in navbar
  return (
    <nav style={styles.nav}>
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <span style={{ fontWeight: "600", color: "#00bcd4" }}>
          👋 Hi, {user.name}
        </span>
        {user.role === "Teacher" && (
          <Link to="/teacher-dashboard" style={styles.link}>Dashboard</Link>
        )}
        {user.role === "Student" && (
          <Link to="/student-dashboard" style={styles.link}>Dashboard</Link>
        )}
      </div>

      <button onClick={handleLogout} style={styles.logoutButton}>
        Logout
      </button>
    </nav>
  );
};

/* ==============================
   💅 INLINE NAVBAR STYLES
   ============================== */
const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: "12px 40px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
    color: "white",
  },
  link: {
    color: "white",
    marginLeft: "20px",
    textDecoration: "none",
    fontWeight: "500",
    transition: "color 0.3s",
  },
  logoutButton: {
    background: "crimson",
    border: "none",
    borderRadius: "8px",
    color: "white",
    padding: "8px 16px",
    cursor: "pointer",
    fontWeight: "500",
  },
};
