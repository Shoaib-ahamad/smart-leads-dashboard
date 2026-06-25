# Smart Leads Dashboard - Project Summary 📋

This document provides a simple, structured overview of the **Smart Leads Dashboard** codebase. It covers the technical stack, repository architecture, security model, and Role-Based Access Control (RBAC) details to make it easy to explain to colleagues, interviewers, or team members.

---

## 🚀 Technical Stack (Tech Stack)

The project is built as a decouple-architected full-stack web application using TypeScript end-to-end:

### 💻 Frontend (Client Workspace)
- **Vite 8 & React 19**: Ultra-fast next-generation development bundler and UI library.
- **TypeScript**: Enforces strict structural typings, interfaces, and compiler safety.
- **Tailwind CSS v3**: Tailwind utility framework for layout design and glassmorphic aesthetics.
- **Recharts**: Data visualization library compiling acquisition channels and status pipelines.
- **Axios**: Promised-based HTTP client for API interaction.
- **React Router v7**: Layout-based client routing with protected state redirection.

### 🔌 Backend (Server Workspace)
- **Node.js & Express 5**: Core runtime and backend router framework.
- **MongoDB & Mongoose 9**: NoSQL database cluster and object modeling design schemas.
- **JSON Web Tokens (JWT)**: Cryptographically signed credentials for session state validation.
- **BcryptJS**: Secure salted password hashing before database storage.

---

## 🏗️ Folder Structure

```
smart-leads-dashboard/
├── client/                     # FRONTEND WORKSPACE
│   ├── src/
│   │   ├── components/layout/ # Fixed Sidebar & Profile Card
│   │   ├── pages/             # Login, Signup, Dashboard, Users (Admin)
│   │   ├── routes/            # Route guards (ProtectedRoute, AdminRoute)
│   │   ├── services/          # API network calls (Auth, Lead, User)
│   │   └── types/             # TS Interfaces (lead.types, auth.types)
├── server/                     # BACKEND WORKSPACE
│   ├── src/
│   │   ├── controllers/       # Auth, Lead, and User Controllers
│   │   ├── middleware/        # auth.middleware (token and role verification)
│   │   ├── models/            # MongoDB Schemas (User, Lead)
│   │   ├── routes/            # Express Routers
│   │   └── server.ts          # Express startup and MongoDB connection
└── PROJECT_SUMMARY.md          # This summary documentation
```

---

## 🔐 Authentication & Session Flow

1. **User Sign Up**: New users create an account on the signup screen. To follow strict security rules, roles automatically default to **`sales`** (cannot self-promote to admin).
2. **User Log In**: User inputs credentials. The backend verifies the password hash via Bcrypt and issues a cryptographically signed JWT token valid for 7 days.
3. **Session Interceptor**: The client saves the token and user metadata to `localStorage`.
   - An **Axios Request Interceptor** in `client/src/services/api.ts` listens to all outgoing requests. If a token exists in local storage, it dynamically injects the `Authorization: Bearer <token>` header. This reduces service code repetition.

---

## 🛡️ Role-Based Access Control (RBAC) Model

The project enforces role security at both the **Backend database layer** and **Frontend client layer**:

### 1. Database & REST Gating (Backend Security)
Endpoints are protected using Express middleware:
- **`protect`**: Decodes the incoming JWT token, verifies its expiration, and resolves the User from the database.
- **`authorizeRoles(...roles)`**: Restricts path execution to specifically authorized roles:
  - `GET /api/leads` -> Allowed for both `admin` and `sales`.
  - `DELETE /api/leads/:id` -> Restricted to **`admin`** only.
  - `GET /api/users` -> Restricted to **`admin`** only.

### 2. UI Element & Route Gating (Frontend Security)
- **Action Gating**: The Leads table in `DashboardPage.tsx` checks the current user's role. The **Delete** action button is visible *only* if the logged-in user is an `admin`.
- **Sidebar Gating**: The sidebar in `DashboardLayout.tsx` checks the current user's role. The **User Management** menu link is visible *only* to `admin` accounts.
- **Route Guards**: In `App.tsx`, the `/users` route is wrapped under a custom `<AdminRoute>` guard. If a user manually changes the URL to `/users` without admin credentials, they are immediately redirected back to `/dashboard`.

### 3. User Management (The Admin Panel)
- Visible only to `admin` users.
- Renders the entire database user registry.
- Admins can promote/demote other users' roles (from `sales` to `admin` and vice versa) using in-place dropdowns, or delete accounts.
- Self-protection controls: Admins cannot demote or delete their own active account, preventing accidental lockouts.

---

## 🔌 API Endpoints Cheat Sheet

| HTTP Method | Route Endpoint | Middleware Gate | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Public | Registers a new account (defaults to `sales`). |
| **POST** | `/api/auth/login` | Public | Returns session token and user details. |
| **GET** | `/api/leads` | JWT + Sales/Admin | Fetches filtered, paginated leads table. |
| **GET** | `/api/leads/stats` | JWT + Sales/Admin | Compiles database analytics for charts. |
| **POST** | `/api/leads` | JWT + Sales/Admin | Ingests a new lead record. |
| **PUT** | `/api/leads/:id` | JWT + Sales/Admin | Modifies details of an existing lead. |
| **DELETE** | `/api/leads/:id` | JWT + Admin Only | Removes lead from the database. |
| **GET** | `/api/users` | JWT + Admin Only | Lists all registered accounts. |
| **PUT** | `/api/users/:id/role` | JWT + Admin Only | Updates user role (admin/sales). |
| **DELETE** | `/api/users/:id` | JWT + Admin Only | Deletes user account from the system. |
