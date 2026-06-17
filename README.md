# Smart Leads Dashboard 🚀

A premium full-stack Customer Relationship Management (CRM) and analytics platform. Built with **TypeScript**, **React**, **Express**, and **MongoDB**, this dashboard allows sales and admin teams to ingest, filter, manage, and analyze business leads in real-time.

---

## 🏗️ Architecture & Project Structure

The project is structured as a monorepo-style workspace with separate front-end and back-end directories, managed cleanly from the root folder:

```
smart-leads-dashboard/
├── client/                 # React Frontend (Vite + TypeScript + TailwindCSS)
│   ├── src/
│   │   ├── assets/         # Static assets and icons
│   │   ├── components/     # Reusable layout and UI components
│   │   ├── pages/          # Full page views (Dashboard, Login)
│   │   ├── routes/         # Protected and authentication routing logic
│   │   ├── services/       # Axios API client services (Auth, Leads)
│   │   └── types/          # TypeScript interface definitions
├── server/                 # Express Backend REST API (TypeScript + Mongoose)
│   ├── src/
│   │   ├── controllers/    # API controllers (Auth, Leads)
│   │   ├── middleware/     # Auth checks & Role-based gatekeepers
│   │   ├── models/         # MongoDB Schemas (User, Lead)
│   │   ├── routes/         # REST API routes (Auth, Leads, Test)
│   │   └── utils/          # Auxiliary helper utilities (JWT generation)
├── package.json            # Root workspace scripts to manage both services
└── README.md               # Main project documentation
```

---

## ✨ Features

- **🔐 Robust Security**: JWT-based Authentication with Axios request interceptors automatically attaching session tokens to secure client requests.
- **🛡️ Role-Based Access Control (RBAC)**: Users are divided into roles (`admin` or `sales`). Certain functions (such as lead deletion) are restricted exclusively to `admin` accounts.
- **📊 Real-Time Global Analytics**: High-fidelity data visualizations (Acquisition Channels & Lead Stages) powered by Recharts. Stats and charts compile dynamically matching your filters, resolving pagination-count limitations.
- **⚡ In-Line CRM CRUD operations**: Fully featured Lead Ingestion, Search, and Filtering with an interactive edit modal and smooth-opening glassmorphic overlays.
- **📂 Exportable Data Sheets**: Single-click CSV export utility.
- **⚡ Performance Loading Skeletons**: Tailored animations provide visual indicators during active network operations.

---

## 🚀 Installation & Local Development

You can manage both services concurrently directly from the root directory.

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) running locally, or a MongoDB Atlas connection string.

### Step 1: Install Dependencies
Run the install script at the root directory to download dependencies for the root, front-end, and back-end directories:
```bash
npm run install:all
```

### Step 2: Configure Environment Variables
You need configuration variables setup in both the server and client sub-folders:

#### 1. Server Configuration (`server/.env`)
Create a file named `.env` in the `server` folder:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/smart-leads
JWT_SECRET=supersecretkey
```

#### 2. Client Configuration (`client/.env`)
Create a file named `.env` in the `client` folder (Vite requires variables to be prefixed with `VITE_`):
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 3: Spin Up Development Servers
Run the unified start command at the project root to spin up Vite and Express concurrently:
```bash
npm run dev
```

- **Frontend**: Accessible at [http://localhost:5173](http://localhost:5173)
- **Backend API**: Listening at [http://localhost:5000](http://localhost:5000)

---

## 🛠️ Unified Workspace Commands

Run these scripts from the project root:
- `npm run install:all` - Installs NPM packages across the root, client, and server workspaces.
- `npm run dev` - Runs both Client (Vite) and Server (ts-node-dev) concurrently with colored terminal outputs.
- `npm run build` - Transpiles the back-end TypeScript into production-ready JavaScript and compiles the front-end production bundle.

---

## 🔌 API Endpoints Reference

### Authentication Paths (`/api/auth`)
* `POST /register` - Registers a new user account (Requires payload: `name`, `email`, `password`, `role`).
* `POST /login` - Sign-in endpoint returning authorization token and user metadata (Requires payload: `email`, `password`).

### Lead Operations Paths (`/api/leads`)
* `GET /` - Fetches a paginated list of leads. (Supports optional query parameters: `search`, `status`, `source`, `page`, `limit`).
* `GET /stats` - Returns database-wide global stats and charts breakdown (Total, Status, Source) matching search filters.
* `GET /:id` - Fetches single lead record by ID.
* `POST /` - Ingests a new lead (Requires payload: `name`, `email`, `status`, `source`).
* `PUT /:id` - Updates lead data.
* `DELETE /:id` - Deletes lead data (Admin exclusive).

---

## 🧪 Verification and Building

- **Compile Client Build**: `npm run build:client` (Uses Vite compiler + `tsc`)
- **Compile Server Build**: `npm run build:server` (Uses `tsc` compiler)
