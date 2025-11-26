# SAFMS Project Report

This document is a detailed technical report for the SAFMS (Smart Assignment & Feedback Management System) repository. It describes the project's purpose, architecture, backend and frontend details, API endpoints, data models, running instructions, known issues, and recommendations for development and deployment.

---

## 1. Project Summary

SAFMS is a lightweight web application for teachers and students to manage assignments, submissions, grading, and doubts. The repository contains two main parts:

- `safms-backend/` — an Express-based REST API server. The project contains a simple file-backed database (`db.json`) and also includes Mongoose model files for an optional MongoDB-based setup.
- `safms-frontend/` — a React single-page application that calls the backend API.

The system is intended as a learning/demo platform and a base for enhancements toward a production-ready system.

---

## 2. High-level Features

- User registration and login with roles (student/teacher).
- JWT-based auth for protected API routes.
- Teacher: create assignments (with questions + optional PDF uploads), view submissions, assign per-question marks and feedback.
- Student: view assignments, submit assignments (text or file upload), view grades and feedback.
- Doubts: students post doubts (optionally anonymous); teachers reply.
- File storage for uploaded assignment PDFs and submission files under `uploads/`.

---

## 3. Architecture Overview

- Frontend (React): UI components organized by role (`Student`, `Teacher`, `Auth`) that call backend REST endpoints.
- Backend (Express): routes are defined in `safms-backend/routes/`, controllers implement logic in `safms-backend/controllers/`, storage is done either with `safms-backend/db.json` via `utils/db.js` or via MongoDB/Mongoose models in `safms-backend/models/`.
- Authentication: JWT tokens issued by auth controller; `auth` middleware verifies tokens and attaches `req.user`.
- File uploads: handled by `multer` in `middlewares/upload.js` and stored in `uploads/`.

Data flow example (submit & grade): Student POSTs to `/api/submit` → backend stores submission in `submissions` → Teacher fetches submissions via `/api/submissions/all` and POSTs grades to `/api/submissions/grade/:submissionId` → backend updates submission record with marks and feedback.

---

## 4. Backend — Components and Responsibilities

Root: `safms-backend/`

- `server.js`
  - Application bootstrap, middleware registration, route mounting, and server listen.
  - In the file-based setup it mounts `routes` and attaches `auth` middleware to protected endpoints.

- `controllers/`
  - `authController.js`: register and login using hashed passwords and JWTs (file-based or Mongoose variant depending on implementation).
  - `assignmentController.js`: create/list assignments (file-based writes to `db.json` or Mongoose save when in Mongo mode).
  - `submissionController.js`: submit assignments, list submissions (student/teacher views), and grade submissions.
  - `doubtController.js`: post doubts and reply to doubts.

- `routes/`
  - `auth.js`: register and login routes.
  - `assignments.js`, `submissions.js`, `doubts.js`: route definitions (may be simple or advanced depending on current branch/state).

- `middlewares/`
  - `auth.js`: JWT verification middleware. Reads Authorization header `Bearer <token>` and sets `req.user`.
  - `upload.js`: `multer` configuration for file uploads; creates `uploads/` if missing.
  - `roleAuth.js`: role-based access helper (may be present or simplified depending on code state).

- `utils/`
  - `db.js`: small helper to read and write `db.json` synchronously for demo mode.
  - `jwt.js`: helper functions `createToken` and `verifyToken` used by legacy file-based auth.

- `models/` (optional)
  - Mongoose models: `User.js`, `Assignment.js`, `Submission.js`, etc. These are provided in some branches/variants of the codebase.

---

## 5. Frontend — Structure & Key Components

Root: `safms-frontend/src/`

- `api/api.js`: convenience wrappers to call the backend endpoints (register, login, upload assignment, etc.).
- `components/Auth/`: `Login.js`, `Register.js` for authentication flows.
- `components/Teacher/`: Create assignments, view and grade submissions, assign scores, manage deadlines, etc.
- `components/Student/`: View assignments, submit assignments, view scores and test history.
- `utils/ProtectedRoute.js`: route guard ensuring only authenticated users access certain views.

Frontend-to-backend mapping (representative):
- `CreateAssignment` → POST `/api/assignments` (multipart form in frontend)
- `SubmitAssignment` → POST `/api/submissions/submit` or `/api/submit` depending on controller variant
- `CheckSubmissions` / `AssignScores` → GET `/api/submissions/all`, POST `/api/submissions/grade/:submissionId`
- `Doubts` components → POST `/api/doubts`, POST `/api/doubts/reply`

Note: Some frontend components expect more advanced backend behavior (file fields, questions arrays, `_id` fields) — the backend must match these expectations.

---

## 6. Data Model Details

File-based (`db.json`) structure (top-level):

```json
{
  "users": [],
  "assignments": [],
  "submissions": [],
  "doubts": []
}
```

Representative object shapes when file-based:
- User: { id, name, email, password (hashed), role }
- Assignment: { id, title, description, deadline, createdBy }
- Submission: { id, assignmentId, studentId, content | fileUrl, submittedAt, marks, feedback }
- Doubt: { id, userId, text, anonymous, reply }

Mongoose model highlights (if using Mongo mode):
- `models/Assignment.js` defines `title`, `description`, `dueDate`, `subject`, `teacherName`, `questions`, `questionsPDF`, `markingSchemePDF`, and `createdBy` (ObjectId ref to `User`).
- `models/Submission.js` defines `assignmentId` (ref), `studentId` (ref), `studentName`, `fileUrl`, `questionScores` (per-question), `totalScore`, and `submittedAt`.

When migrating to MongoDB, ensure controllers consistently use ObjectId references and populate as necessary.

---

## 7. API Endpoints (detailed)

This section documents the active file-based API endpoints that the frontend expects. The exact routes in your code may vary depending on recent edits; consult `safms-backend/routes/` and `safms-backend/controllers/` for the authoritative list.

Authentication
- POST `/api/auth/register`
  - Body: { name, email, password, role }
  - Returns: { token, user }

- POST `/api/auth/login`
  - Body: { email, password }
  - Returns: { token, user }

Assignments
- POST `/api/assignments` (protected)
  - Body: { title, description, deadline } or multipart with PDFs depending on implementation.
  - Returns created assignment object.

- GET `/api/assignments` (protected)
  - Returns list of assignments.

Submissions
- POST `/api/submit` (protected)
  - Body (file-based flow): { assignmentId, content } or multipart file upload depending on controller.
  - Returns created submission.

- POST `/api/grade` (protected)
  - Body: { submissionId, marks, feedback }
  - Returns updated submission with marks/feedback.

Doubts
- POST `/api/doubts` (protected)
  - Body: { text, anonymous }
  - Returns created doubt record.

- POST `/api/doubts/reply` (protected)
  - Body: { doubtId, reply }
  - Returns updated doubt record.

Error responses are typically JSON with `msg` or `message` fields — controllers may vary in exact key names.

---

## 8. Running & Testing Locally

Steps to run backend and frontend locally (Windows PowerShell examples):

1) Backend

```powershell
cd c:\Users\HP\OneDrive\Desktop\safms\safms-backend
npm install
# If you want to use MongoDB models, set MONGO_URI in .env
npm start
```

If `EADDRINUSE` occurs, either stop the process using that port or run on another port:

```powershell
$env:PORT=5001; npm start
```

2) Frontend

```powershell
cd c:\Users\HP\OneDrive\Desktop\safms\safms-frontend
npm install
npm start
```

3) Quick smoke tests (PowerShell curl examples):

Register + login

```powershell
curl -Method POST -Uri http://localhost:5000/api/auth/register -Body (ConvertTo-Json @{ name='Alice'; email='alice@example.com'; password='pass123'; role='student' }) -ContentType 'application/json'

curl -Method POST -Uri http://localhost:5000/api/auth/login -Body (ConvertTo-Json @{ email='alice@example.com'; password='pass123' }) -ContentType 'application/json'
```

Create assignment (teacher)

```powershell
curl -Method POST -Uri http://localhost:5000/api/assignments -Headers @{ Authorization = "Bearer <token>" } -Body (ConvertTo-Json @{ title='HW1'; description='Solve problems'; deadline='2025-12-01' }) -ContentType 'application/json'
```

Submit assignment (student)

```powershell
curl -Method POST -Uri http://localhost:5000/api/submit -Headers @{ Authorization = "Bearer <token>" } -Body (ConvertTo-Json @{ assignmentId='<assignmentId>'; content='My answer' }) -ContentType 'application/json'
```

Grade submission (teacher)

```powershell
curl -Method POST -Uri http://localhost:5000/api/grade -Headers @{ Authorization = "Bearer <teacherToken>" } -Body (ConvertTo-Json @{ submissionId='<submissionId>'; marks=85; feedback='Good work' }) -ContentType 'application/json'
```

---

## 9. Known Issues & Limitations

- The file-based storage (`db.json`) uses synchronous file operations which are not safe under concurrent writes.
- JWT secret is hard-coded in some modules in the file-based variant; this should be moved to env vars.
- No comprehensive input validation or sanitization is present; controllers trust incoming payloads in many places.
- File upload limits and MIME checks are not enforced by default.
- The repository contains both file-based and Mongoose-based code; this mixed state can be confusing.

---

## 10. Recommendations & Roadmap

Short term (immediate):

1. Centralize configuration: read `JWT_SECRET`, `PORT`, and `MONGO_URI` from `.env`.
2. Add request validation (use `express-validator`) to protect endpoints from invalid data.
3. Add file upload limits and allowed MIME types in `multer` configuration.

Medium term:

1. Migrate fully to a single storage mode (preferably MongoDB with Mongoose) and remove `db.json` to reduce confusion.
2. Add role-based middleware for teacher-only endpoints (create assignments, grade submissions, reply doubts).
3. Add unit and integration tests and a CI pipeline.

Long term / production:

1. Add proper logging, monitoring, and error-reporting (e.g., Winston + Sentry).
2. Harden security (rate limiting, CORS origin allowlist, HTTPS, secure cookie handling if used).
3. Consider using cloud storage (S3) for uploaded files instead of local `uploads/`.

---

## 11. Appendix: Where to look in the codebase

- Backend entry: `safms-backend/server.js`
- Controllers: `safms-backend/controllers/*.js`
- Routes: `safms-backend/routes/*.js`
- Middlewares: `safms-backend/middlewares/*.js`
- Small JSON DB for demos: `safms-backend/db.json` and helpers in `safms-backend/utils/db.js`
- Frontend entry: `safms-frontend/src/index.js`
- Frontend components: `safms-frontend/src/components/`

---

If you want, I can:

- produce a `safms-backend/README.md` with concrete curl/postman examples matching the exact controller implementation currently present; or
- convert the project to a single consistent storage approach (file-based → remain, or migrate to MongoDB) and implement missing endpoints (tests) that the frontend currently expects.

Tell me which of those you prefer and I'll proceed.
