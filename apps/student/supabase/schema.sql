-- ==============================================================================
-- HIREZONE DATABASE ARCHITECTURE (Supabase / PostgreSQL)
-- Common Shared Schema for Student, Recruiter, and Government Portals
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ROLES & USERS
CREATE TYPE user_role AS ENUM ('student', 'recruiter', 'government_officer', 'admin');

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. PROFILES
CREATE TABLE IF NOT EXISTS student_profiles (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    college VARCHAR(200) NOT NULL,
    degree VARCHAR(150),
    graduation_year VARCHAR(10),
    avatar_url TEXT,
    as_score NUMERIC(5,2) DEFAULT 0.00 CHECK (as_score >= 0 AND as_score <= 100),
    total_xp INTEGER DEFAULT 0 CHECK (total_xp >= 0),
    github_url TEXT,
    linkedin_url TEXT,
    resume_url TEXT,
    portfolio_url TEXT,
    permit_recruiter_visibility BOOLEAN DEFAULT TRUE,
    permit_govt_verification BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS recruiter_profiles (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    company_name VARCHAR(200) NOT NULL,
    designation VARCHAR(150) NOT NULL,
    industry VARCHAR(150),
    location VARCHAR(150),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS government_profiles (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    department VARCHAR(200) NOT NULL,
    designation VARCHAR(150) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. COMPANIES & SKILLS
CREATE TABLE IF NOT EXISTS companies (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    company_type VARCHAR(50) NOT NULL CHECK (company_type IN ('Software', 'Hardware', 'Hybrid')),
    headquarters VARCHAR(200),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS company_domains (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id VARCHAR(100) REFERENCES companies(id) ON DELETE CASCADE,
    domain_name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS company_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id VARCHAR(100) REFERENCES companies(id) ON DELETE CASCADE,
    skill_name VARCHAR(100) NOT NULL
);

-- 4. PROJECTS & ROADMAPS
CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(250) NOT NULL,
    domain VARCHAR(100) NOT NULL,
    industry_category VARCHAR(100) NOT NULL,
    difficulty VARCHAR(50) NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
    estimated_duration VARCHAR(100),
    description TEXT NOT NULL,
    expected_output TEXT NOT NULL,
    descriptive_question_prompt TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id VARCHAR(100) REFERENCES projects(id) ON DELETE CASCADE,
    skill_name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS project_roadmaps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id VARCHAR(100) UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
    total_checkpoints INTEGER DEFAULT 6,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS roadmap_stages (
    id VARCHAR(100) PRIMARY KEY,
    project_id VARCHAR(100) REFERENCES projects(id) ON DELETE CASCADE,
    stage_number INTEGER NOT NULL,
    title VARCHAR(250) NOT NULL,
    short_description TEXT,
    stage_type VARCHAR(50) NOT NULL CHECK (stage_type IN ('concept', 'skill_learning', 'guided_task', 'core_build', 'test_improve', 'final_challenge')),
    xp_reward INTEGER DEFAULT 100 CHECK (xp_reward >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS roadmap_tasks (
    id VARCHAR(100) PRIMARY KEY,
    stage_id VARCHAR(100) REFERENCES roadmap_stages(id) ON DELETE CASCADE,
    title VARCHAR(250) NOT NULL,
    objective TEXT NOT NULL,
    explanation TEXT NOT NULL,
    expected_output TEXT NOT NULL,
    instructions JSONB NOT NULL DEFAULT '[]'::jsonb,
    checklist JSONB NOT NULL DEFAULT '[]'::jsonb,
    hints JSONB DEFAULT '[]'::jsonb,
    xp_reward INTEGER DEFAULT 200,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. LEARNING RESOURCES (NPTEL, Coursera, Official Docs)
CREATE TABLE IF NOT EXISTS learning_resources (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(250) NOT NULL,
    provider VARCHAR(100) NOT NULL,
    topic VARCHAR(150) NOT NULL,
    skill_covered VARCHAR(100) NOT NULL,
    level VARCHAR(50) NOT NULL,
    estimated_duration VARCHAR(50),
    url TEXT NOT NULL,
    is_official BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_learning_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stage_id VARCHAR(100) REFERENCES roadmap_stages(id) ON DELETE CASCADE,
    resource_id VARCHAR(100) REFERENCES learning_resources(id) ON DELETE CASCADE
);

-- 6. STUDENT FAVOURITES & ENROLLMENT PROGRESS
CREATE TABLE IF NOT EXISTS student_favourite_companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_id VARCHAR(100) REFERENCES companies(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, company_id)
);

CREATE TABLE IF NOT EXISTS student_project_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    project_id VARCHAR(100) REFERENCES projects(id) ON DELETE CASCADE,
    company_id VARCHAR(100) REFERENCES companies(id) ON DELETE SET NULL,
    current_stage_id VARCHAR(100) REFERENCES roadmap_stages(id),
    completion_percentage NUMERIC(5,2) DEFAULT 0.00,
    total_xp_earned INTEGER DEFAULT 0,
    descriptive_score NUMERIC(5,2),
    overall_score NUMERIC(5,2),
    status VARCHAR(50) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(student_id, project_id)
);

CREATE TABLE IF NOT EXISTS student_roadmap_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enrollment_id UUID REFERENCES student_project_enrollments(id) ON DELETE CASCADE,
    stage_id VARCHAR(100) REFERENCES roadmap_stages(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(enrollment_id, stage_id)
);

CREATE TABLE IF NOT EXISTS student_task_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enrollment_id UUID REFERENCES student_project_enrollments(id) ON DELETE CASCADE,
    task_id VARCHAR(100) REFERENCES roadmap_tasks(id) ON DELETE CASCADE,
    completed_items JSONB DEFAULT '[]'::jsonb,
    is_completed BOOLEAN DEFAULT FALSE,
    evidence_url TEXT,
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(enrollment_id, task_id)
);

-- 7. MCQ SYSTEM
CREATE TABLE IF NOT EXISTS mcq_questions (
    id VARCHAR(100) PRIMARY KEY,
    stage_id VARCHAR(100) REFERENCES roadmap_stages(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_answer INTEGER NOT NULL,
    explanation TEXT NOT NULL,
    topic VARCHAR(150),
    difficulty VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS mcq_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    stage_id VARCHAR(100) REFERENCES roadmap_stages(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    answers JSONB NOT NULL,
    attempt_count INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. DESCRIPTIVE SUBMISSIONS & AI EVALUATIONS
CREATE TABLE IF NOT EXISTS descriptive_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id VARCHAR(100) REFERENCES projects(id) ON DELETE CASCADE,
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    answer_text TEXT NOT NULL,
    github_url TEXT,
    demo_url TEXT,
    notes TEXT,
    status VARCHAR(50) DEFAULT 'submitted' CHECK (status IN ('submitted', 'evaluated', 'pending')),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID UNIQUE REFERENCES descriptive_submissions(id) ON DELETE CASCADE,
    overall_score NUMERIC(5,2) NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
    technical_understanding_score NUMERIC(5,2),
    project_knowledge_score NUMERIC(5,2),
    problem_solving_score NUMERIC(5,2),
    clarity_score NUMERIC(5,2),
    strengths JSONB DEFAULT '[]'::jsonb,
    weaknesses JSONB DEFAULT '[]'::jsonb,
    suggested_improvements JSONB DEFAULT '[]'::jsonb,
    feedback TEXT NOT NULL,
    evaluated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. BADGES & XP
CREATE TABLE IF NOT EXISTS badges (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    icon_name VARCHAR(100) NOT NULL,
    domain VARCHAR(100) NOT NULL,
    required_achievement TEXT NOT NULL,
    xp_reward INTEGER DEFAULT 100
);

CREATE TABLE IF NOT EXISTS student_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    badge_id VARCHAR(100) REFERENCES badges(id) ON DELETE CASCADE,
    earned_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, badge_id)
);

-- 10. RECRUITER CONNECTIONS & INVITATIONS
CREATE TABLE IF NOT EXISTS recruiter_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    recruiter_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'connected', 'declined')),
    initiated_by VARCHAR(20) CHECK (initiated_by IN ('student', 'recruiter')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, recruiter_id)
);

CREATE TABLE IF NOT EXISTS recruiter_invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recruiter_id UUID REFERENCES users(id) ON DELETE CASCADE,
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
    sent_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. MARKET DEMAND & NEWS
CREATE TABLE IF NOT EXISTS job_market_trends (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    domain VARCHAR(100) NOT NULL UNIQUE,
    growth_percentage NUMERIC(5,2),
    demand_level VARCHAR(50),
    open_roles_estimate INTEGER,
    top_skills JSONB DEFAULT '[]'::jsonb,
    sample_data_source TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS news_articles (
    id VARCHAR(100) PRIMARY KEY,
    headline TEXT NOT NULL,
    summary TEXT NOT NULL,
    source_name VARCHAR(150) NOT NULL,
    publication_date VARCHAR(50),
    related_domain VARCHAR(100),
    relevant_skills JSONB DEFAULT '[]'::jsonb,
    original_url TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_project_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE descriptive_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruiter_connections ENABLE ROW LEVEL SECURITY;

-- Students have full access to their own data
CREATE POLICY "Students can view and update own profile" ON student_profiles
    FOR ALL USING (auth.uid() = id);

-- Recruiters can view student profiles if permit_recruiter_visibility is TRUE
CREATE POLICY "Recruiters view visible student profiles" ON student_profiles
    FOR SELECT USING (permit_recruiter_visibility = TRUE);

-- Government officers can query authorized verification data
CREATE POLICY "Govt view verified career milestones" ON student_profiles
    FOR SELECT USING (permit_govt_verification = TRUE);

-- Public read access to market trends and news
ALTER TABLE job_market_trends ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view job trends" ON job_market_trends FOR SELECT USING (TRUE);

ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view news" ON news_articles FOR SELECT USING (TRUE);
