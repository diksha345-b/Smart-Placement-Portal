# Smart Placement Portal (MERN)

A production-style placement portal where **students** upload resumes and apply
to jobs, **recruiters (HR)** post jobs and review auto-ranked applicants, and
**admins** manage users, jobs, and view platform analytics.

Built with **MongoDB, Express, React, Node.js**, Tailwind CSS, and JWT auth.

---

## Key Features

### Student
- Register / login, update profile
- Upload a PDF resume → automatic **resume score**, detected skills, and suggestions
- Browse & search jobs, apply with a cover note
- Track application status (auto-assigned by smart matching)

### HR / Recruiter
- Register / login
- Create, edit, and delete job posts (with required skills)
- View applicants **ranked by match score**
- Shortlist or reject candidates

### Admin
- Dashboard overview
- Manage users (activate / deactivate / delete)
- Manage jobs (remove any post)
- Platform analytics with charts

### Resume Upload & Analysis
- PDF type + size validation on **both** frontend and backend
- Text extracted with `pdf-parse`
- Skills detected against a curated dictionary, score generated, suggestions produced

```json
{
  "score": 80,
  "skills": ["React", "Node.js", "MongoDB"],
  "missingSkills": ["Docker"],
  "suggestions": ["Add deployment experience"]
}
```

### Smart Shortlisting
When a student applies, their skills are compared to the job's required skills:

| Match score | Status        |
| ----------- | ------------- |
| 0 – 40%     | Rejected      |
| 41 – 70%    | Under Review  |
| 71 – 100%   | Shortlisted   |

The match score, matched/missing skills, and status are stored on the application.

---

## Tech Stack

**Backend:** Express, Mongoose, JWT, bcryptjs, multer, pdf-parse, express-validator
**Frontend:** React, React Router, Axios, React Hook Form + Yup, Tailwind CSS, Recharts, React Hot Toast, Vite

---

## Project Structure

```
Smart-Placement-Portal/
├── backend/
│   ├── config/            # db connection
│   ├── controllers/       # auth, user, job, application, resume, admin, meta
│   ├── middleware/        # auth (JWT + RBAC), upload (multer), validate, errorHandler
│   ├── models/            # User, Job, Application
│   ├── routes/            # one router per resource + index
│   ├── services/          # resumeService (scoring), matchService (shortlisting)
│   ├── validations/       # express-validator chains
│   ├── utils/             # apiResponse, asyncHandler, ApiError, token, skills
│   ├── seed/              # seedAdmin.js
│   ├── uploads/           # stored resume PDFs
│   ├── app.js             # express app
│   └── server.js          # entry point
│
└── frontend/
    └── src/
        ├── components/    # common/ forms/ cards/ tables/
        ├── pages/         # auth/ student/ hr/ admin/ shared/
        ├── layouts/       # DashboardLayout, AuthLayout, Sidebar, Topbar
        ├── services/      # axios api + per-resource services
        ├── hooks/         # useAuth, useDebounce
        ├── context/       # AuthContext
        ├── validations/   # yup schemas
        ├── routes/        # ProtectedRoute, PublicRoute
        ├── utils/         # constants, helpers
        └── styles/        # global.css
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB running locally (or a MongoDB Atlas connection string)

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env      # then edit values (Windows: copy .env.example .env)
npm run seed              # creates the admin account (see output for credentials)
npm run dev               # starts on http://localhost:5000
```

Default seeded admin (override via `ADMIN_EMAIL` / `ADMIN_PASSWORD` env vars):

```
email:    admin@portal.com
password: Admin@123
```

#### Backend environment variables (`backend/.env`)

| Variable          | Description                          | Example                                          |
| ----------------- | ------------------------------------ | ------------------------------------------------ |
| `PORT`            | API port                             | `5000`                                           |
| `NODE_ENV`        | environment                          | `development`                                    |
| `MONGO_URI`       | MongoDB connection string            | `mongodb://127.0.0.1:27017/smart_placement_portal` |
| `JWT_SECRET`      | secret for signing tokens            | `a-long-random-string`                           |
| `JWT_EXPIRES_IN`  | token lifetime                       | `7d`                                             |
| `CLIENT_URL`      | frontend origin for CORS             | `http://localhost:5173`                          |
| `MAX_FILE_SIZE_MB`| max resume upload size               | `5`                                              |

### 2. Frontend

```bash
cd frontend
npm install
npm run dev               # starts on http://localhost:5173
```

The Vite dev server proxies `/api` and `/uploads` to the backend on port 5000,
so no extra configuration is needed for local development.

---

## API Overview

All responses follow a consistent shape:

```json
// success
{ "success": true, "message": "Success", "data": {} }
// error
{ "success": false, "message": "Validation failed", "errors": [] }
```

| Method | Endpoint                          | Access        | Description                         |
| ------ | --------------------------------- | ------------- | ----------------------------------- |
| POST   | `/api/auth/register`              | Public        | Register (student or hr)            |
| POST   | `/api/auth/login`                 | Public        | Login                               |
| GET    | `/api/auth/me`                    | Private       | Current user                        |
| PUT    | `/api/users/profile`              | Private       | Update profile                      |
| GET    | `/api/users/resume-score`         | Student       | Get resume analysis                 |
| POST   | `/api/resume/upload`              | Student       | Upload + analyze resume (PDF)       |
| GET    | `/api/resume/download`            | Student       | Download stored resume              |
| GET    | `/api/jobs`                       | Private       | List/search jobs (paginated)        |
| GET    | `/api/jobs/:id`                   | Private       | Job detail                          |
| POST   | `/api/jobs`                       | HR            | Create job                          |
| PUT    | `/api/jobs/:id`                   | HR / Admin    | Update job                          |
| DELETE | `/api/jobs/:id`                   | HR / Admin    | Delete job                          |
| GET    | `/api/jobs/hr/mine`               | HR            | HR's jobs + applicant counts        |
| POST   | `/api/applications/:jobId`        | Student       | Apply (runs smart matching)         |
| GET    | `/api/applications/mine`          | Student       | My applications                     |
| GET    | `/api/applications/job/:jobId`    | HR / Admin    | Applicants for a job (ranked)       |
| PATCH  | `/api/applications/:id/status`    | HR / Admin    | Shortlist / reject                  |
| GET    | `/api/admin/analytics`            | Admin         | Platform metrics                    |
| GET    | `/api/admin/users`                | Admin         | List users                          |
| PATCH  | `/api/admin/users/:id/status`     | Admin         | Activate / deactivate user          |
| DELETE | `/api/admin/users/:id`            | Admin         | Delete user (cascade)               |
| GET    | `/api/admin/jobs`                 | Admin         | List all jobs                       |
| DELETE | `/api/admin/jobs/:id`             | Admin         | Delete any job                      |
| GET    | `/api/meta/skills`                | Public        | Known skills (for pickers)          |

---

## Notes
- Admin accounts are created only via the seed script, not the public register endpoint.
- Resume uploads are stored under `backend/uploads/` and ignored by git.
- Passwords are hashed with bcrypt and never returned by the API.
```
