# HIREZONE — Student Career Development Platform
> **LEARN · BUILD · GROW**

HIREZONE is an interactive, daylight-themed, AI-powered student career development platform engineered for engineering students, hackathon demonstrations (Smart India Hackathon), and industry recruitment readiness.

---

## 🏛️ Tri-Portal Shared Architecture

HIREZONE is designed around a unified database and API ecosystem linking three specialized frontends:

```
                      ┌───────────────────────────────────────┐
                      │          Supabase PostgreSQL         │
                      │       Shared Database Architecture    │
                      └──────────────────┬────────────────────┘
                                         │
                   ┌─────────────────────┴─────────────────────┐
                   │           Shared Express REST API          │
                   │          (Port 3000 / JSON Endpoints)     │
                   └───────┬─────────────┬─────────────┬───────┘
                           │             │             │
              ┌────────────┴──┐   ┌──────┴──────┐   ┌──┴─────────────┐
              │ STUDENT PORTAL│   │  RECRUITER  │   │   GOVERNMENT   │
              │ (This Project)│   │   PORTAL    │   │     PORTAL     │
              │  /student     │   │  /recruiter │   │  /government   │
              └───────────────┘   └─────────────┘   └────────────────┘
```

### Shared Database Integration Contract
1. **Common Schema**: Located in `supabase/schema.sql`. Contains 12 core tables (`users`, `student_profiles`, `recruiter_profiles`, `government_profiles`, `companies`, `projects`, `roadmap_stages`, `roadmap_tasks`, `mcq_attempts`, `descriptive_submissions`, `ai_evaluations`, `badges`, `recruiter_connections`, `recruiter_invitations`).
2. **Access Separation**:
   - **Student Portal**: Reads job demand, selects companies, completes roadmaps, submits tasks & MCQs, requests AI evaluations, connects with recruiters.
   - **Recruiter Portal**: Queries students who have enabled `permit_recruiter_visibility = TRUE`. Accesses verified AS Scores, project reflection grades, and sends invitations via `/api/invitations`.
   - **Government Portal**: Accesses anonymized or authorized student career skill credentials via `/api/government/approved-student-data` with strict permission gates (`permit_govt_verification = TRUE`).

---

## 🚀 Core Student Learning Journey

The Student Portal connects learning seamlessly from exploration to recruiter visibility:

```
DASHBOARD (Welcome & Summary Metrics)
    ↓
JOB-MARKET DEMAND (Domain & Skill Growth Trends)
    ↓
NEWS & INDUSTRY TRENDS (The Hindu, Mint, ET with "Explore Related Projects")
    ↓
EXPLORE COMPANIES (28+ Software & Hardware Leaders + Favourites)
    ↓
CHOOSE PROJECT (Robotics, AI, Full-Stack, Cloud, IoT, Electronics)
    ↓
VIEW REQUIRED SKILLS (Prerequisites & Estimated Duration)
    ↓
TREASURE-HUNT ROADMAP (Visual Checkpoints with XP & Progress)
    ↓
NPTEL / COURSERA LEARNING (Curated Official Resources)
    ↓
GUIDED PROJECT TASKS (Step-by-step Instructions & Checklists)
    ↓
MCQs (Non-blocking: 1/5 continues with feedback, 5/5 earns bonus XP)
    ↓
DESCRIPTIVE PROJECT QUESTION (In-depth engineering reflection)
    ↓
AI-ASSISTED SCORE (Gemini 3.8 Flash technical evaluation & strengths)
    ↓
BADGES + XP (Career Ready, Robotics Explorer, Project Finisher)
    ↓
FINAL PROFILE (Showcases verified projects, scores, and links)
    ↓
RECRUITER CONNECTIONS (Discover recruiters, accept interview invitations)
```

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Lucide React Icons, Motion, Daylight CSS
- **Backend**: Node.js, Express, TypeScript (`tsx`), CORS, Dotenv
- **AI Evaluation**: `@google/genai` (Model: `gemini-3.8-flash`) with fallback evaluation engine
- **Database**: Supabase PostgreSQL with Row Level Security (RLS) & UUID keys
- **Packaging**: Built-in client-side ZIP export engine for full project export

---

## 📋 API Contract Summary

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health and DB status |
| `GET` | `/api/student/dashboard` | Student statistics, active journey, and metrics |
| `GET` | `/api/trends` | Job-market growth rates and in-demand skills |
| `GET` | `/api/news` | Verified industry news articles with domain tags |
| `GET` | `/api/companies` | Filterable list of software/hardware companies |
| `POST` | `/api/companies/:id/favourite` | Add company to student favourites |
| `DELETE`| `/api/companies/:id/favourite` | Remove company from student favourites |
| `GET` | `/api/projects` | Filter projects by domain, difficulty, company |
| `POST` | `/api/projects/:id/enroll` | Enroll in project and start treasure roadmap |
| `GET` | `/api/student/journeys` | Fetch active roadmap and checkpoint statuses |
| `PATCH`| `/api/student/journeys/:id/progress` | Advance to next roadmap checkpoint |
| `POST` | `/api/student/tasks/:id/complete` | Mark task checklist complete & award XP |
| `POST` | `/api/mcq-attempts` | Submit checkpoint MCQs (allows continuation) |
| `POST` | `/api/descriptive-submissions` | Submit reflection question for Gemini AI evaluation |
| `GET` | `/api/recruiters` | List verified recruiter profiles |
| `POST` | `/api/connections` | Send connection request to recruiter |
| `GET` | `/api/invitations` | View incoming recruiter interview invitations |
| `PATCH`| `/api/invitations/:id` | Accept or decline recruiter invitations |
| `GET` | `/api/student/profile` | Retrieve student career profile |
| `PATCH`| `/api/student/profile` | Update profile, links, and privacy settings |
| `GET` | `/api/government/approved-student-data`| Government verification endpoint |
