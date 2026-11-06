# 🇮🇳 GovJobs Tracker (Sarkari Naukri Portal)

> **Version:** 1.0 | **Author:** Mahir Kumar  
> Ek verified, accurate aur clean government job notification tracker portal jahan students ko 10th, 12th, Graduate aur Diploma eligibility ke hisaab se sahi jobs milti hain with last date reminders.

---

## 🌟 Key Features (Implemented as per PRD)

### 1. Public & Guest-First Portal
- **Zero Forced Login:** Students bina kisi obstruction ke directly jobs browse aur search kar sakte hain.
- **Verification First:** Har job ke saath official website, direct apply link aur official notification PDF link.
- **Smart At-a-Glance Cards:** Total vacancies count, qualification chip, application fees, age limit aur last date countdown badge (`3 days left`, `Ends Today`).

### 2. Powerful Filters & Search
- **Search Bar:** Real-time search across job titles, departments, and exam keywords (e.g. `SSC`, `Railway`, `Police`).
- **Eligibility Filters:** 10th Pass, 12th Pass, Graduate, Diploma.
- **Sector Filters:** SSC, Railway, Banking, Police, Teaching, Defence, State PSC.
- **Location Selector:** All India + State-specific filters (Bihar, UP, Rajasthan, MP, Delhi).
- **Closing Soon Toggle:** One-click filter for vacancies closing within 7 days.

### 3. Last Date Reminder System
- User apna email enter karke kisi bhi job ke liye **Free Last Date Email Reminder** set kar sakta hai.
- Weekly newsletter digest subscription for latest verified job circulars.

### 4. Admin Management
- Admin modal/panel to publish new jobs with department, vacancies, qualifications, fee structure, age limit, dates, and official URLs.

### 5. Bookmark / Saved Jobs
- Students can bookmark jobs to view later (persisted locally with zero friction).

---

## 📁 Project Structure

```
website/
├── client/                      # Frontend (React 18 + TypeScript + Vite + Tailwind CSS)
│   ├── public/
│   ├── src/
│   │   ├── components/          # Navbar, HeroBanner, SearchBar, FilterBar, JobCard, Modals, Footer
│   │   ├── services/            # API integration + offline fallback mock data
│   │   ├── types/               # TypeScript interfaces (Job, Filters, Stats)
│   │   ├── App.tsx              # Main App layout & reactive state
│   │   ├── main.tsx
│   │   └── index.css            # Tailwind directives & styles
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── server/                      # Backend (Node.js + Express + TypeScript + Mongoose)
│   ├── src/
│   │   ├── config/              # MongoDB connection
│   │   ├── controllers/         # Job, Auth, and Subscriber controllers
│   │   ├── middleware/          # Admin JWT verification
│   │   ├── models/              # Job, User, Subscriber schemas
│   │   ├── routes/              # Express API route handlers
│   │   ├── seed/                # Pre-populated realistic Indian Govt Jobs
│   │   └── server.ts            # Express server entry point
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── govjobs-tracker-prd.md       # Original Product Requirement Document
├── package.json                 # Monorepo management scripts
└── README.md
```

---

## 🚀 Quick Start Guide

### Step 1: Install Dependencies
Aap ek command se root se dono client aur server dependencies install kar sakte hain:

```bash
# In project root
npm run install:all
```

Ya individually:
```bash
# Server dependencies
cd server
npm install

# Client dependencies
cd ../client
npm install
```

### Step 2: Configure Server Environment (.env)
`server/.env.example` ko `server/.env` mein copy karein:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/govjobs_tracker
JWT_SECRET=your_super_secret_jwt_key_here
ADMIN_EMAIL=admin@govjobstracker.in
ADMIN_PASSWORD=adminsecretpassword123
CLIENT_URL=http://localhost:5173
```

*(Note: Agar MongoDB locally install nahi hai ya Atlas URI available nahi hai, client tab bhi safely built-in offline mock dataset ke saath smoothly chalta hai!)*

### Step 3: Seed Database (Optional)
Pre-populated sample data (SSC CGL, Railway NTPC, Bihar Police, UP Police, IBPS PO, Agniveer) insert karne ke liye:

```bash
npm run seed:server
```

### Step 4: Run Development Servers

**Frontend (Client):**
```bash
npm run dev:client
# Runs on http://localhost:5173
```

**Backend (Server):**
```bash
npm run dev:server
# Runs on http://localhost:5000
```

---

## 📡 REST API Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/jobs` | Get jobs with query filters (search, qualification, state, category, closingSoon) | No |
| `GET` | `/api/jobs/:id` | Get single job details (increments views) | No |
| `GET` | `/api/jobs/stats/summary` | Get active jobs, vacancies count, closing soon count | No |
| `POST` | `/api/jobs` | Create/publish new job post | Admin (JWT) |
| `PUT` | `/api/jobs/:id` | Update existing job | Admin (JWT) |
| `DELETE` | `/api/jobs/:id` | Delete job | Admin (JWT) |
| `POST` | `/api/subscribers/reminder` | Set email reminder for job deadline | No |
| `POST` | `/api/subscribers/newsletter` | Subscribe to weekly updates | No |
| `POST` | `/api/auth/login` | Admin login | No |

---

## 🛡️ License
MIT License. Created by Mahir Kumar.
