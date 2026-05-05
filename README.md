# ProjectFlow — Project Management App

A full-stack project management web application with JWT authentication, role-based access control, and a Kanban-style task board.

## Tech Stack

**Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT, bcryptjs, express-validator  
**Frontend:** React 18, Vite, Tailwind CSS v3, Axios, React Router v6, React Hot Toast

---

## Project Structure

```
project-root/
├── backend/
│   ├── src/
│   │   ├── config/         # DB connection
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Auth, validation, error handling, logging
│   │   ├── models/         # Mongoose models (User, Project, Task)
│   │   ├── routes/         # Express routers
│   │   ├── services/       # Business logic
│   │   └── utils/          # JWT helper, ApiError class
│   ├── app.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Layout, shared UI
│   │   ├── context/        # AuthContext
│   │   ├── pages/          # Dashboard, Projects, ProjectDetail, Login, Signup
│   │   ├── routes/         # ProtectedRoute
│   │   ├── services/       # Axios instance + API calls
│   │   └── utils/
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── .env.example
│   └── package.json
└── README.md
```

---

## Quick Start

### 1. Clone & install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure environment variables

**Backend** — copy `.env.example` to `.env` and fill in:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/projectmanagement
JWT_SECRET=your_super_secret_key_min_32_chars
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

**Frontend** — copy `.env.example` to `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run in development

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

- Backend: http://localhost:5000  
- Frontend: http://localhost:5173

---

## API Reference

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/signup` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login and receive JWT |
| GET | `/api/auth/me` | Auth | Get current user profile |

### Projects
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/projects` | Auth | Create a project |
| GET | `/api/projects` | Auth | Get all projects for current user |
| GET | `/api/projects/:id` | Auth (member) | Get project details |
| PUT | `/api/projects/:id` | Auth (owner) | Update project |
| DELETE | `/api/projects/:id` | Auth (owner) | Delete project + its tasks |
| POST | `/api/projects/:id/invite` | Auth (owner) | Invite a member by email |

### Tasks
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/tasks` | Auth (member) | Create a task |
| GET | `/api/tasks?projectId=xxx` | Auth (member) | Get tasks by project |
| PUT | `/api/tasks/:id` | Auth (member) | Update task (status, etc.) |
| DELETE | `/api/tasks/:id` | Auth (member) | Delete a task |

### Dashboard
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/dashboard` | Auth | Get stats: total/completed/overdue tasks, recent activity |

---

## Features

- **JWT Authentication** — Secure signup/login with hashed passwords (bcrypt)
- **Role-Based Access Control** — Admin and Member roles
- **Project Management** — Create, update, delete projects; invite team members by email
- **Kanban Task Board** — Tasks organized into Todo / In Progress / Done columns
- **Dashboard** — Real-time stats: task counts, overdue alerts, status breakdown, recent activity
- **Protected Routes** — Frontend routes guarded by auth state
- **Global Error Handling** — Centralized error middleware with proper HTTP status codes
- **Input Validation** — All API inputs validated with express-validator
- **CORS Configured** — Supports credentials, configurable via FRONTEND_URL env var

---
