# SmartNotes — Production MERN Stack Notes Management System

> **"Organize your knowledge. Learn smarter."**  
> A premium, modern SaaS-style notes management application engineered for academic excellence, software engineering documentation, and professional project presentations.

---

## Architecture Overview

```text
notes-management-system/
│
├── frontend/                     # React 18 + Vite + Tailwind CSS Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/           # Reusable UI components (Sidebar, Navbar, NoteCard, etc.)
│   │   ├── context/              # React Context (AuthContext, ThemeContext, ToastContext)
│   │   ├── pages/                # Application pages (Dashboard, Notes, CreateNote, etc.)
│   │   ├── services/             # Axios API client and endpoint services
│   │   ├── App.jsx               # Application router and layout
│   │   ├── main.jsx              # Entry point
│   │   └── index.css             # Tailwind base & custom design tokens
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                      # Node.js + Express + MongoDB REST API
│   ├── config/                   # MongoDB Mongoose connection
│   ├── controllers/              # Business logic (auth, notes, categories, dashboard, user)
│   ├── middleware/               # JWT authentication & error handling middleware
│   ├── models/                   # Mongoose Schemas (User, Note, Category)
│   ├── routes/                   # Express route definitions
│   ├── utils/                    # JWT generator and seedData script (10 college notes)
│   ├── .env                      # Environment configuration
│   ├── server.js                 # Express server entry point
│   └── package.json
│
├── start-all.bat                 # One-click launcher for Frontend & Backend
├── start-backend.bat             # Launch Backend only (Port 5000)
├── start-frontend.bat            # Launch Frontend only (Port 5173)
└── README.md                     # Project documentation
```

---

## Key Features

1. **Enterprise Authentication**:
   - JWT (JSON Web Token) authentication with bearer authorization headers.
   - Secure password hashing using `bcryptjs`.
   - Protected routes and automated token validation on startup.
   - Built-in one-click demo login button for presentation viva.

2. **MongoDB Data Persistence**:
   - Verified connection to MongoDB on `localhost:27017`.
   - Indexed queries with text-search capabilities over title, content, category, and tags.
   - User data isolation: each user can only access their own notes and categories.

3. **Modern SaaS UI / UX Design**:
   - Inspired by Linear, Notion, and Google Drive.
   - Deep Indigo (`#4F46E5`), Purple (`#7C3AED`), and Blue (`#2563EB`) primary palette.
   - Subtle category and status accents (Emerald, Amber, Cyan, Rose).
   - Card hover elevation (`transform: translateY(-3px)`) and smooth micro-interactions.
   - Clean Inter typography with high readability contrast.

4. **Complete Dark Mode**:
   - Comprehensive dark mode (`#0B1120` background, `#111827` cards, `#263244` borders).
   - Theme toggle in navbar and settings (Light, Dark, System preference).
   - Saved in `localStorage` and automatically synchronized.

5. **Rich Note Editor**:
   - Full markdown formatting toolbar: Bold, Italic, Headings, Lists, Checklists, Code blocks, Blockquotes.
   - Live Preview tab vs. Write tab.
   - Dynamic tag manager with badge pills.
   - Reading time estimator and word counter.
   - Save Draft, Save Note, and Cancel controls.

6. **Soft Delete & Trash Recovery**:
   - Notes are safely soft-deleted (`isDeleted = true, deletedAt = Date`).
   - Dedicated Trash page with Restore, Permanent Purge, and Empty Trash features.
   - Modal confirmations prevent accidental data loss.

7. **Subject Categories & Filtering**:
   - 8 pre-seeded subject categories (Programming, Database, Web Development, AI & Machine Learning, Computer Science, Mathematics, Personal, Other).
   - Category creation and editing modal with custom color accents and icons.
   - Note count badge per category.

8. **Live Debounced Search & Sorting**:
   - 300ms debounced search to prevent redundant API calls.
   - Sorting options: Recently Updated, Recently Created, Title A–Z, Title Z–A.
   - Grid View vs. List View toggle.

---

## Quick Start (Demonstration Mode)

### Option A: One-Click Startup (Recommended)
Double-click `start-all.bat` in the root directory. It will:
1. Start the Express API server on `http://localhost:5000`.
2. Start the Vite React frontend on `http://localhost:5173`.
3. Open your default web browser to the application.

### Option B: Manual Terminal Execution

#### 1. Start MongoDB:
Ensure MongoDB is running locally:
```powershell
Get-Service MongoDB
```

#### 2. Start Backend:
```powershell
cd backend
node server.js
```
API runs at `http://localhost:5000/api`

#### 3. Start Frontend:
```powershell
cd frontend
npm run dev
```
Open `http://localhost:5173`

---

## Demo Credentials

You can log in with the pre-seeded demo user or register a brand new account:
- **Email**: `demo@smartnotes.com`
- **Password**: `password123`
*(Or click the "One-Click Demo Login" button on the login screen)*

### Pre-seeded Technical College Notes:
1. Python Basics & Core Data Types
2. Java OOP Concepts & Principles
3. DBMS Normalization & Relational Design
4. React Hooks Deep Dive
5. Node.js Architecture & Event Loop
6. Machine Learning Basics: Supervised vs Unsupervised
7. Computer Networks: The OSI vs TCP/IP Model
8. Operating Systems: Process vs Thread & CPU Scheduling
9. Essential SQL Queries & Optimization Cheatsheet
10. Data Structures: Hash Tables, Trees & Graphs

---

## REST API Documentation

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register new student user (auto-creates default categories)
- `POST /api/auth/login` — Sign in and receive JWT token
- `GET  /api/auth/me` — Retrieve current authenticated user profile

### Notes (`/api/notes`)
- `GET    /api/notes` — Get notes (supports `category`, `favorite`, `q`, `sort`, `page`, `limit`)
- `POST   /api/notes` — Create note
- `GET    /api/notes/:id` — Get note by ID
- `PUT    /api/notes/:id` — Update note
- `DELETE /api/notes/:id` — Soft-delete note (move to trash)
- `PUT    /api/notes/:id/restore` — Restore note from trash
- `DELETE /api/notes/:id/permanent` — Permanently purge note from MongoDB
- `PUT    /api/notes/:id/favorite` — Toggle favorite status
- `GET    /api/notes/trash/all` — List all trashed notes
- `DELETE /api/notes/trash/empty` — Empty entire recycle bin

### Categories (`/api/categories`)
- `GET    /api/categories` — Get categories with aggregated note counts
- `POST   /api/categories` — Create custom category
- `PUT    /api/categories/:id` — Update category
- `DELETE /api/categories/:id` — Delete category (reassigns notes to Other)

### Dashboard (`/api/dashboard`)
- `GET    /api/dashboard/stats` — Retrieve Total Notes, Favorites, Category count, Recent Activity, and recent notes list

### User Management (`/api/users`)
- `PUT    /api/users/profile` — Update name, role, bio
- `PUT    /api/users/password` — Change password
- `DELETE /api/users/account` — Permanently delete user account and all notes
