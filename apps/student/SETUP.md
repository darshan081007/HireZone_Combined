# HIREZONE — Setup & Developer Guide
> Windows 10 / 11 · PowerShell · Node.js 18+ · Supabase

## 1. Prerequisites
- **Node.js**: Version 18.0.0 or higher ([Download Node.js](https://nodejs.org/))
- **npm**: Version 9.0.0 or higher
- **PowerShell**: Windows Terminal or standard PowerShell 5.1 / 7+
- **Code Editor**: VS Code recommended

---

## 2. Windows PowerShell Setup Commands

Execute the following commands in order inside PowerShell:

```powershell
# 1. Clone or extract the project folder
cd HireZone_Student_Final

# 2. Verify Node.js and npm installations
node -v
npm -v

# 3. Install all production and dev dependencies
npm install

# 4. Create local environment configuration file from template
Copy-Item .env.example .env

# 5. Open in VS Code (Optional)
code .

# 6. Run the fullstack development server (Express backend + Vite frontend)
npm run dev
```

> **Note for Windows 11 Smart App Control Users:**
> If Windows blocks native Rollup binaries (`ERR_DLOPEN_FAILED` / `Application Control policy has blocked this file`), run:
> ```powershell
> npm install @rollup/wasm-node --save-dev
> npm run dev
> ```
> This switches Rollup to pure WebAssembly, bypassing Windows security blocks completely.

Once started, the console will output:
```text
[HIREZONE] Student Portal Server running on http://localhost:3000
```
Open **`http://localhost:3000`** in your browser (Google Chrome or Microsoft Edge).

---

## 3. Environment Variables Configuration

Open `.env` in your editor and configure:

```env
# Google Gemini API Key (for AI-assisted project evaluation)
GEMINI_API_KEY=your_actual_gemini_api_key

# Supabase PostgreSQL Configuration (Optional: built-in in-memory fallback is active by default)
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...

# Port Configuration
PORT=3000
```

> **Note on AI Evaluation**: If `GEMINI_API_KEY` is not set or network is unreachable, HIREZONE automatically activates its robust fallback evaluation engine. It awards transparent, fair heuristic scores based on engineering rubric criteria and preserves the submission without crashing.

---

## 4. Supabase Database Setup Instructions

1. Log into your [Supabase Dashboard](https://supabase.com/).
2. Create a new project named **`HIREZONE_DB`**.
3. Select your preferred database region (e.g. `ap-south-1` Mumbai).
4. Navigate to the **SQL Editor** tab on the left sidebar.
5. Click **New Query**.
6. Open `supabase/schema.sql` from this project repository, copy the entire SQL script, paste it into the editor, and click **Run**.
7. All 12 tables, relationships, UUID defaults, check constraints, and Row Level Security policies will be created instantly.
8. Copy your project URL and API keys from **Project Settings > API** into your `.env` file.

---

## 5. Multi-Frontend Integration Guide for Recruiter & Government Friends

Your friends who are developing the **Recruiter Portal** and **Government Portal** can connect directly to this backend without rewriting your code:

### For the Recruiter Portal Developer:
- **Base API URL**: `http://localhost:3000/api`
- **Candidate Discovery**: Call `GET /api/student/profile` or query `student_profiles` where `permit_recruiter_visibility = true`.
- **Sending Invitations**: Call `POST /api/invitations` with payload:
  ```json
  {
    "recruiterId": "rec_01",
    "studentId": "student_ssn_01",
    "roleTitle": "Robotics Firmware Intern",
    "message": "We loved your Line Following Robot calibration notes!",
    "domain": "Robotics"
  }
  ```
- **Connection Management**: Call `GET /api/connections` and `PATCH /api/connections/:id`.

### For the Government Portal Developer:
- **Base API URL**: `http://localhost:3000/api`
- **Audited Career Records**: Call `GET /api/government/approved-student-data`.
- This endpoint returns verified student credentials with `permit_govt_verification = true`, preventing access to private communications.

---

## 6. Build and Production Verification

```powershell
# Run TypeScript compilation check
npm run lint

# Build production bundle (Vite frontend + esbuild backend)
npm run build

# Start production server
npm start
```
