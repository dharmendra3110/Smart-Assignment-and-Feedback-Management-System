# SAFMS — Smart Assignment & Feedback Management System

This repository contains a lightweight assignment and feedback management system with two parts:

- `safms-backend/` — Express-based backend (simple file-based storage + optional MongoDB variants)
- `safms-frontend/` — React frontend (connects to backend via REST API)

This README explains the project structure, features, setup, API endpoints, example requests, and recommendations for development and deployment.

---

## Table of Contents

- Project overview
- Features
- Architecture & data flow
- Quick Start (development)
  - Backend
  - Frontend
- Environment variables
- API Reference (endpoints & examples)
- File uploads
- Storage modes: file-based vs MongoDB
- Troubleshooting
- Recommended improvements
- Contributing
- License

---

## Project overview

SAFMS is a small web app for teachers and students to manage assignments, submissions, grading, scores, and doubts. It provides:

- Teacher flows: create assignments with questions and optional PDFs, view submissions, grade per-question and leave feedback.
- Student flows: view assignments, submit answers or files, view grades and feedback, post doubts anonymously or not.
- Lightweight operation: a file-based JSON database (`db.json`) is provided for quick local development. There are also Mongoose models in the codebase if you prefer to run with MongoDB.

This repository is intended for educational/demo use and as a starting point for production-grade improvements.

---

## Features

- User registration and login (roles: `student` and `teacher`).
- JWT-based authentication for protected routes.
- Create assignments (teacher) with optional questions and PDFs.
- Students can list assignments, submit work (upload files), view their submissions.
- Teachers can view all submissions for their assignments, grade submissions (per-question marks + feedback).
- Doubts: students can post doubts (optionally anonymous); teachers can reply.
- Simple file storage under `uploads/` managed by `multer`.

---

## Architecture & data flow

- Frontend (React) → Backend (Express) via REST.
- Backend routes are implemented in `safms-backend/routes/` and handlers in `safms-backend/controllers/`.
- Authentication uses JWT tokens; protected routes use an `auth` middleware which verifies tokens and attaches `req.user`.
- Data is persisted either to `safms-backend/db.json` (file-based) or to MongoDB using Mongoose models in `safms-backend/models/` depending on controller choice.

---

## Quick Start (development)

Prerequisites:

- Node.js (v16+ recommended)
- npm
- (Optional) MongoDB server if you want to use the Mongoose-backed controllers

1) Backend

```powershell
cd c:\Users\HP\OneDrive\Desktop\safms\safms-backend
npm install
# Start server
npm start
# or for development with auto-reload (nodemon):
npm run dev
```

By default the backend listens on port `5000`. If you get `EADDRINUSE` (address already in use), free the port or start with a different one: `PORT=5001 npm start` (Windows PowerShell: `$env:PORT=5001; npm start`).

2) Frontend

```powershell
cd c:\Users\HP\OneDrive\Desktop\safms\safms-frontend
npm install
npm start
```

The frontend's base URL for API calls is defined in `src/config.js`. Ensure it points to your running backend (e.g., `http://localhost:5000`).

---

## Environment variables

Create a `.env` file in `safms-backend/` for optional configuration when using real MongoDB or customizing the server:

```
MONGO_URI=your-mongodb-uri   # optional, for MongoDB use
JWT_SECRET=your_jwt_secret   # optional, defaults to a built-in dev string
PORT=5000
```

Notes:
- The project includes a small `utils/jwt.js` and `middlewares/auth.js` which use a hard-coded secret in the simple file-based variant — for production, set `JWT_SECRET` and update modules to read it.
- If you intend to use the Mongoose models included in `safms-backend/models/`, set `MONGO_URI` and switch controllers to the Mongoose variants (see "Storage modes" below).

---

## API Reference (selected endpoints)

All endpoints return JSON and respond with appropriate HTTP status codes on errors.

Authentication

- POST /api/auth/register
  - Body: { name, email, password, role }
  - Response: { token, user }

- POST /api/auth/login
  - Body: { email, password }
  - Response: { token, user }

Assignments

- POST /api/assignments  (protected)
  - Body (JSON or multipart): { title, description, deadline, subject, questions (JSON string) }
  - Optional file fields (multipart): `questionsPDF`, `markingSchemePDF`
  - Response: created assignment

- GET /api/assignments  (protected)
  - Response: list of assignments

Submissions

- POST /api/submit  (protected)
  - Body: either JSON { assignmentId, content } or multipart file upload (field name `file`) depending on the frontend component used
  - Response: created submission

- POST /api/grade  (protected for grading users)
  - Body: { submissionId, marks, feedback }
  - Response: graded submission

Doubts

- POST /api/doubts  (protected)
  - Body: { text, anonymous }
  - Response: posted doubt

- POST /api/doubts/reply  (protected, typically teacher)
  - Body: { doubtId, reply }
  - Response: updated doubt with reply

Example curl (PowerShell) — register + login:

```powershell
# Register
curl -Method POST -Uri http://localhost:5000/api/auth/register -Body (ConvertTo-Json @{ name='Alice'; email='alice@example.com'; password='pass123'; role='teacher' }) -ContentType 'application/json'

# Login
curl -Method POST -Uri http://localhost:5000/api/auth/login -Body (ConvertTo-Json @{ email='alice@example.com'; password='pass123' }) -ContentType 'application/json'
```

Use the returned `token` in the `Authorization` header for protected calls:

`Authorization: Bearer <token>`

---

## File uploads

- Uploads are handled by `multer` and saved into `safms-backend/uploads/`.
- Filenames are generated with a timestamp prefix to avoid collisions.
- The frontend constructs `FormData` and posts with `multipart/form-data` when sending files (assignment PDFs or submission files).

Security recommendations for uploads:
- Enforce file size limits in `middlewares/upload.js`.
- Whitelist allowed MIME types (e.g., PDF, images) to avoid dangerous uploads.
- Serve uploads statically only from a safe path and avoid executing any uploaded content.

---

## Storage modes: file-based vs MongoDB

This codebase contains both a simple file-based storage (`utils/db.js`, `db.json`) and Mongoose models (`models/`). Which one the server uses depends on the controller implementation in `controllers/`.

- File-based (`db.json`):
  - Simple, zero-dependency DB for local demos.
  - Uses synchronous `fs.readFileSync` and `fs.writeFileSync`.
  - Not safe for concurrent writes; OK for demos and single-user dev.

- MongoDB (Mongoose models):
  - Better for multi-user, concurrency, and production-like behavior.
  - To use: set `MONGO_URI` in `.env` and ensure controllers import & use Mongoose models and `mongoose.connect()` is called in `server.js`.

If you plan to develop further or deploy, migrate to MongoDB or another proper DB instead of `db.json`.

---

## Troubleshooting

- Server fails with `EADDRINUSE` when port is in use: change `PORT` or stop the process using that port. On Windows PowerShell you can set a different port like:

```powershell
$env:PORT=5001; npm start
```

- If uploads are failing: check `uploads/` exists and is writable. `middlewares/upload.js` creates the directory if missing.

- If CORS errors appear, ensure frontend `BASE_URL` matches backend origin or adjust backend CORS settings in `server.js`.

- If using MongoDB, start `mongod` or ensure `MONGO_URI` points to a running instance.

---

## Recommended improvements (short list)

1. Move `JWT_SECRET` into environment variables and remove hard-coded secrets.
2. Replace synchronous file DB with an async DB or migrate fully to MongoDB.
3. Add input validation (e.g., `express-validator`) for all controllers.
4. Enforce file size and MIME type limits for uploads.
5. Add role-based access middleware to protect teacher-only endpoints.
6. Add tests (unit + integration) and a CI pipeline.

---

## Contributing

Contributions welcome. Suggested workflow:

1. Fork repository.
2. Create a topic branch: `feature/my-change`.
3. Make changes and add tests.
4. Open a pull request describing the change and how to test it.

Please run linting and tests before opening PRs.

---

## License

This project is MIT-licensed. See the `LICENSE` file for details (if present).

---

If you want, I can also:

- generate a `README` specifically for `safms-backend/` with endpoint details and sample requests tailored to the controller implementations that are currently active; or
- create a small Postman collection / Insomnia export with all API calls prefilled; or
- convert the project to a consistent MongoDB-backed implementation and remove the file-based code.

Which of the above would you like next?
