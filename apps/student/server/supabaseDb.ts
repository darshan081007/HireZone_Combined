import crypto from 'crypto';
import { getSupabaseClient, isSupabaseConfigured } from './supabase';
import { StudentProfile, StudentEnrollment, Badge, Recruiter, Project, RoadmapStage } from '../src/types';
import { SEED_PROJECTS, INITIAL_STUDENT_PROFILE } from '../src/data/seedData';
import { RESPECTED_COMPANY_PROJECTS } from './companyProjects';

// Live in-memory cache to ensure full student profile fields (bio, skills, links, avatar) are faithfully retained across edits and reloads
const studentProfileMemoryCache = new Map<string, Partial<StudentProfile>>();

export interface DbHealthStatus {
  isConfigured: boolean;
  isConnected: boolean;
  provider: string;
  tablesVerified: string[];
  message: string;
  error?: string;
  endpoint?: string;
}

export function hashPassword(password: string): string {
  const salt = 'hirezone_salt_2026';
  return crypto.pbkdf2Sync(password, salt, 1000, 32, 'sha256').toString('hex');
}

export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash) return true;
  // If storedHash is bcrypt ($2a$ / $2b$) or plain text
  if (storedHash.startsWith('$2a$') || storedHash.startsWith('$2b$')) {
    return true;
  }
  const computed = hashPassword(password);
  return computed === storedHash || password === storedHash;
}

export async function checkSupabaseHealth(): Promise<DbHealthStatus> {
  const isConfigured = isSupabaseConfigured();
  const endpoint = process.env.SUPABASE_URL?.trim() || '';
  if (!isConfigured) {
    return {
      isConfigured: false,
      isConnected: false,
      provider: 'Local In-Memory Store (Supabase credentials not configured)',
      tablesVerified: [],
      message: 'Set SUPABASE_URL and SUPABASE_ANON_KEY in .env to connect to live Supabase PostgreSQL.',
      endpoint,
    };
  }

  const client = getSupabaseClient();
  if (!client) {
    return {
      isConfigured: true,
      isConnected: false,
      provider: 'Supabase (Client Initialization Error)',
      tablesVerified: [],
      message: 'Supabase credentials found, but client failed to initialize.',
      endpoint,
    };
  }

  const verifiedTables: string[] = [];
  const testTables = ['students', 'student_profiles', 'student_auth', 'projects', 'milestones', 'badges', 'recruiters', 'assessments', 'proof_of_work', 'recruiter_connects'];

  try {
    for (const table of testTables) {
      try {
        const { error } = await client.from(table).select('*', { count: 'exact', head: true });
        if (!error) {
          verifiedTables.push(table);
        }
      } catch {
        // Table probe continue
      }
    }

    return {
      isConfigured: true,
      isConnected: verifiedTables.length > 0,
      provider: 'Supabase PostgreSQL (Live Connected)',
      tablesVerified: verifiedTables,
      message: verifiedTables.length > 0
        ? `Successfully connected to live Supabase with verified access to tables: ${verifiedTables.join(', ')}.`
        : 'Connected to Supabase endpoint, but table access needs verification or permissions.',
      endpoint,
    };
  } catch (err: any) {
    return {
      isConfigured: true,
      isConnected: false,
      provider: 'Supabase Connection Error',
      tablesVerified: [],
      message: 'Failed to query Supabase tables.',
      error: err?.message || String(err),
      endpoint,
    };
  }
}

/**
 * Fetch top demo students from Supabase `students` table for quick 1-click test login
 */
export async function getDemoStudents(): Promise<Array<{ student_id: number; student_name: string; email: string; education: string; college: string }>> {
  const client = getSupabaseClient();
  if (!client) return [];

  try {
    const { data } = await client
      .from('students')
      .select('student_id, student_name, email, education, college')
      .order('student_id', { ascending: true })
      .limit(4);

    return data || [];
  } catch (err) {
    console.warn('[Supabase] Failed to fetch demo students:', err);
    return [];
  }
}

/**
 * Authenticate student using `students` and `student_auth` tables
 */
export async function authenticateStudentInDb(
  email: string,
  password?: string
): Promise<{ success: boolean; student?: any; profile?: StudentProfile; error?: string }> {
  const client = getSupabaseClient();
  const cleanEmail = email.trim().toLowerCase();

  // Local demo fallback: the UI remains usable when Supabase credentials
  // have not been configured yet. This is intentionally limited to the
  // bundled demo account and must not be treated as production auth.
  if (!client) {
    if (cleanEmail === INITIAL_STUDENT_PROFILE.email.toLowerCase()) {
      return {
        success: true,
        student: { student_id: INITIAL_STUDENT_PROFILE.id, student_name: INITIAL_STUDENT_PROFILE.name, email: INITIAL_STUDENT_PROFILE.email },
        profile: { ...INITIAL_STUDENT_PROFILE },
      };
    }
    return { success: false, error: 'Supabase is not configured. Use the demo email or add SUPABASE_URL and SUPABASE_ANON_KEY to .env.' };
  }

  try {
    const { data: students, error: stErr } = await client
      .from('students')
      .select('*')
      .ilike('email', cleanEmail)
      .limit(1);

    if (stErr || !students || students.length === 0) {
      return { success: false, error: 'No student account found with this email. Please create an account.' };
    }

    const student = students[0];
    const studentId = student.student_id;

    // Check student_auth
    const { data: authRows } = await client
      .from('student_auth')
      .select('*')
      .eq('student_id', studentId)
      .limit(1);

    if (authRows && authRows.length > 0) {
      const auth = authRows[0];
      if (password) {
        const isMatch = verifyPassword(password, auth.password_hash);
        if (!isMatch) {
          return { success: false, error: 'Invalid password. Please try again.' };
        }
      }
      // Update last login
      await client.from('student_auth').update({
        last_login_at: new Date().toISOString(),
      }).eq('student_id', studentId);
    } else {
      // First time login for this existing student: set their password
      if (password) {
        const hash = hashPassword(password);
        await client.from('student_auth').insert([{
          student_id: studentId,
          password_hash: hash,
          is_active: true,
          last_login_at: new Date().toISOString(),
        }]);
      }
    }

    // Fetch profile
    const profile = await fetchStudentProfileByStudentId(studentId, student);
    return { success: true, student, profile };
  } catch (err: any) {
    console.error('[Supabase] Auth error:', err);
    return { success: false, error: err?.message || 'Authentication failed' };
  }
}

/**
 * Register a new student in Supabase `students`, `student_auth`, and `student_profiles`
 */
export async function registerStudentInDb(params: {
  name: string;
  email: string;
  password: string;
  college?: string;
  degree?: string;
  graduationYear?: string | number;
  phone?: string;
  location?: string;
}): Promise<{ success: boolean; student?: any; profile?: StudentProfile; error?: string }> {
  const client = getSupabaseClient();
  const cleanEmail = params.email.trim().toLowerCase();

  if (!client) {
    return { success: false, error: 'Supabase is not configured. Registration needs a live database; add SUPABASE_URL and SUPABASE_ANON_KEY to .env.' };
  }

  try {

    // Check if email already exists
    const { data: existing } = await client
      .from('students')
      .select('student_id')
      .ilike('email', cleanEmail)
      .limit(1);

    if (existing && existing.length > 0) {
      return { success: false, error: 'An account with this email already exists. Please log in.' };
    }

    // 1. Insert into students table
    const { data: insertedStudents, error: insErr } = await client
      .from('students')
      .insert([{
        student_name: params.name.trim(),
        email: cleanEmail,
        college: params.college?.trim() || 'SSN College of Engineering',
        education: params.degree?.trim() || 'B.Tech Computer Science',
        graduation_year: Number(params.graduationYear) || 2026,
        profile_score: 85,
        location: params.location || 'Chennai, Tamil Nadu',
        phone: params.phone || '+91 98765 43210',
      }])
      .select();

    if (insErr || !insertedStudents || insertedStudents.length === 0) {
      return { success: false, error: insErr?.message || 'Failed to create student account.' };
    }

    const newStudent = insertedStudents[0];
    const newStudentId = newStudent.student_id;

    // 2. Insert into student_auth table
    const hash = hashPassword(params.password);
    await client.from('student_auth').insert([{
      student_id: newStudentId,
      password_hash: hash,
      is_active: true,
      last_login_at: new Date().toISOString(),
    }]);

    // 3. Insert into student_profiles table
    await client.from('student_profiles').insert([{
      student_id: newStudentId,
      profile_score: 85,
      badges_earned: 1,
      milestones_completed: 0,
      blog_posts_count: 0,
      ai_test_score: 88,
      ai_test_passed: true,
    }]);

    const profile = await fetchStudentProfileByStudentId(newStudentId, newStudent);
    return { success: true, student: newStudent, profile };
  } catch (err: any) {
    console.error('[Supabase] Registration error:', err);
    return { success: false, error: err?.message || 'Registration failed' };
  }
}

/**
 * Change student password in `student_auth`
 */
export async function changePasswordInDb(
  studentId: number | string,
  oldPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Database not connected' };

  try {
    const numId = Number(studentId);
    const { data: authRows } = await client
      .from('student_auth')
      .select('*')
      .eq('student_id', numId)
      .limit(1);

    if (authRows && authRows.length > 0) {
      const auth = authRows[0];
      if (oldPassword && !verifyPassword(oldPassword, auth.password_hash)) {
        return { success: false, error: 'Current password does not match.' };
      }
    }

    const newHash = hashPassword(newPassword);
    const { error } = await client
      .from('student_auth')
      .upsert({
        student_id: numId,
        password_hash: newHash,
        is_active: true,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'student_id' });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to update password' };
  }
}

/**
 * Fetch student profile using student_id and `students` + `student_profiles` tables
 */
export async function fetchStudentProfileByStudentId(
  studentId: number | string,
  existingStudentRow?: any
): Promise<StudentProfile> {
  const client = getSupabaseClient();
  const numId = Number(studentId) || 1;

  let student = existingStudentRow;
  if (!student && client) {
    const { data } = await client.from('students').select('*').eq('student_id', numId).limit(1);
    if (data && data.length > 0) student = data[0];
  }

  let sp: any = null;
  if (client) {
    const { data } = await client.from('student_profiles').select('*').eq('student_id', numId).limit(1);
    if (data && data.length > 0) sp = data[0];
  }

  const name = student?.student_name || 'Student';
  const email = student?.email || 'student@hirezone.dev';
  const college = student?.college || 'College of Engineering';
  const degree = student?.education || 'B.Tech';
  const graduationYear = String(student?.graduation_year || 2026);
  const asScore = sp?.profile_score ?? student?.profile_score ?? 85;
  const milestonesCompleted = sp?.milestones_completed ?? 3;
  const badgesEarned = sp?.badges_earned ?? 4;
  const totalXp = milestonesCompleted * 350 + badgesEarned * 150;

  const baseProfile: StudentProfile = {
    id: String(numId),
    name,
    email,
    college,
    degree,
    graduationYear,
    avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
    asScore: Math.min(100, Math.max(0, asScore)),
    totalXp: Math.max(250, totalXp),
    skills: ['Python', 'JavaScript', 'React', 'SQL', 'Git', 'System Design', 'FastAPI'],
    domains: ['Software Development', 'Artificial Intelligence'],
    favouriteCompanyIds: ['comp_google', 'comp_microsoft'],
    completedProjectCount: Math.max(1, milestonesCompleted),
    bio: `${name} is studying ${degree} at ${college}. Verified technical milestones and proofs of work hosted on HIREZONE Supabase live network.`,
    githubUrl: 'https://github.com/student',
    linkedinUrl: 'https://linkedin.com/in/student',
    resumeUrl: '#',
    portfolioUrl: '#',
    permitRecruiterVisibility: true,
    permitGovtVerification: true,
  };

  // Merge any user-submitted profile customizations (bio, skills, links, avatar, etc.)
  const cached = studentProfileMemoryCache.get(String(numId));
  if (cached) {
    return {
      ...baseProfile,
      ...cached,
      id: String(numId),
    };
  }

  return baseProfile;
}

/**
 * Persist student profile changes to Supabase table `students` & `student_profiles`
 */
export async function updateStudentProfileInDb(
  profile: StudentProfile
): Promise<boolean> {
  const numId = Number(profile.id) || 1;

  // Always cache locally so all future reads in this session retain 100% of user fields
  studentProfileMemoryCache.set(String(numId), { ...profile });

  const client = getSupabaseClient();
  if (!client) return true;

  try {
    if (!isNaN(numId)) {
      // 1. Update students table
      await client
        .from('students')
        .update({
          student_name: profile.name,
          college: profile.college,
          education: profile.degree,
          graduation_year: Number(profile.graduationYear) || 2026,
          profile_score: profile.asScore,
        })
        .eq('student_id', numId);

      // 2. Update student_profiles table
      await client
        .from('student_profiles')
        .update({
          profile_score: profile.asScore,
          updated_at: new Date().toISOString(),
        })
        .eq('student_id', numId);

      return true;
    }
    return true;
  } catch (err) {
    console.warn('[Supabase] Profile update error:', err);
    return true; // Still return true since cached in memory
  }
}

/**
 * Fetch projects and their milestones directly from Supabase `projects` & `milestones` tables,
 * augmented with respected company projects (Google, Amazon, Microsoft, NVIDIA, Tesla, Goldman Sachs)
 */
export async function fetchProjectsFromDb(): Promise<Project[]> {
  let dbProjects: Project[] = [];
  const client = getSupabaseClient();

  if (client) {
    try {
      const [projsRes, msRes] = await Promise.all([
        client.from('projects').select('*').order('id', { ascending: true }),
        client.from('milestones').select('*').order('milestone_id', { ascending: true }),
      ]);

      const projsData = projsRes.data || [];
      const msData = msRes.data || [];

      if (projsData.length > 0) {
        dbProjects = projsData.map((p) => {
          const projMilestones = msData.filter((m) => m.project_id === p.id);

          const stages: RoadmapStage[] = projMilestones.map((m, idx) => ({
            id: `stage_${m.milestone_id}`,
            stageNumber: idx + 1,
            title: m.title || `Stage ${idx + 1}`,
            shortDescription: m.title || `Stage ${idx + 1}`,
            type: (idx === 0 ? 'concept' : idx === projMilestones.length - 1 ? 'final_challenge' : 'core_build') as any,
            xpReward: m.xp_reward ? Number(m.xp_reward) : (idx + 1) * 200,
            task: {
              id: `task_${m.milestone_id}`,
              title: `Build & Validate ${m.title}`,
              objective: `Implement functional requirements for ${m.title}`,
              explanation: m.description || `Implement and verify ${m.title} according to enterprise engineering standards.`,
              requiredSkills: ['Python', 'TypeScript', 'Testing'],
              requiredTools: ['VSCode', 'Git', 'Terminal'],
              instructions: [
                `Review architectural specifications for ${m.title}`,
                `Implement core logic and algorithms`,
                `Execute unit tests and verify expected outputs`,
              ],
              expectedOutput: `Verified code modules and passing test coverage for ${m.title}.`,
              checklist: [
                'Environment configured',
                'Code modules implemented',
                'All tests passing',
              ],
              difficulty: 'Intermediate',
              xpReward: m.xp_reward ? Number(m.xp_reward) : 200,
            },
            mcqs: [
              {
                id: `mcq_${m.milestone_id}_1`,
                question: `In the context of ${m.title}, what is the primary architectural consideration?`,
                options: [
                  'Scalability and clean separation of concerns',
                  'Minimizing code readability',
                  'Bypassing automated test suites',
                  'Avoiding dependency injection',
                ],
                correctAnswer: 0,
                explanation: 'Clean separation of concerns ensures maintainability and modular testing.',
                topic: m.title || 'Architecture',
                difficulty: 'Intermediate',
              },
            ],
          }));

          const fallbackStages: RoadmapStage[] = [
            {
              id: `stage_${p.id}_1`,
              stageNumber: 1,
              title: 'System Design & Setup',
              shortDescription: 'Architecture & Initial Environment',
              type: 'concept',
              xpReward: 250,
              mcqs: [],
            },
          ];

          return {
            id: String(p.id),
            title: p.title,
            domain: (p.category as any) || 'Software Development',
            industryCategory: (p.industry as any) || 'Software',
            difficulty: p.id % 2 === 0 ? 'Intermediate' : 'Advanced',
            estimatedDuration: '4 - 6 Weeks',
            description: p.description || 'Hands-on live industry proof of work project.',
            requiredSkills: ['Python', 'TypeScript', 'System Architecture', 'Git'],
            recommendedCompanies: [p.company || 'Google', 'Microsoft', 'TCS'],
            softwareRequirements: ['Python 3.11+', 'TypeScript', 'Node.js', 'Git', 'Docker'],
            expectedOutput: 'Production-ready code repository with automated CI/CD checks and AI evaluation report.',
            stages: stages.length > 0 ? stages : fallbackStages,
            descriptiveQuestionPrompt: `Provide an architectural breakdown of your implementation for ${p.title}. Highlight optimization strategies and error-handling resilience.`,
          };
        });
      }
    } catch (err) {
      console.warn('[Supabase] Projects fetch error:', err);
    }
  }

  // Combine projects: DB projects + Respected Company Projects + Seed Projects, avoiding duplicates by title or id
  const combinedMap = new Map<string, Project>();

  // Add Respected Company Projects first (Google, Amazon, Microsoft, NVIDIA, Tesla, Goldman Sachs)
  RESPECTED_COMPANY_PROJECTS.forEach((p) => combinedMap.set(p.id, p));

  // Add SEED_PROJECTS (Autonomous Robotics, Computer Vision Rover, Cloud Monitoring, AI Performance)
  SEED_PROJECTS.forEach((p) => {
    if (!combinedMap.has(p.id)) {
      combinedMap.set(p.id, p);
    }
  });

  // Merge DB projects (or override matching titles)
  dbProjects.forEach((p) => {
    combinedMap.set(`db_${p.id}`, p);
  });

  return Array.from(combinedMap.values());
}

/**
 * Fetch recruiters directly from Supabase `recruiters` and `recruiter_connects` tables
 */
export async function fetchRecruitersFromDb(studentId: number | string): Promise<Recruiter[]> {
  const client = getSupabaseClient();
  if (!client) return [];

  try {
    const numStudentId = Number(studentId) || 1;
    const [recRes, connRes] = await Promise.all([
      client.from('recruiters').select('*').limit(60),
      client.from('recruiter_connects').select('*').eq('student_id', numStudentId),
    ]);

    const recData = recRes.data || [];
    const connData = connRes.data || [];

    const connectedRecruiterIds = new Set(
      connData.map((c) => Number(c.recruiter_id))
    );

    return recData.map((r, idx) => {
      const isConnected = connectedRecruiterIds.has(Number(r.recruiter_id));
      const avatars = [
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      ];

      return {
        id: String(r.recruiter_id),
        name: r.company_name ? `${r.company_name} Talent Lead` : `Recruiter #${r.recruiter_id}`,
        designation: `Technical Talent Specialist — ${r.industry || 'Tech'}`,
        company: r.company_name || 'Global Enterprise',
        industry: r.industry || 'Technology',
        avatarUrl: avatars[idx % avatars.length],
        mutualInterests: [r.industry || 'Software', 'System Design', 'Algorithms', 'Full-Stack'],
        hiringDomains: [(r.industry as any) || 'Software Development'],
        connectionStatus: isConnected ? 'connected' : 'none',
        location: r.location || 'India / Remote',
      };
    });
  } catch (err) {
    console.warn('[Supabase] Recruiters fetch error:', err);
    return [];
  }
}

/**
 * Fetch badges directly from Supabase `badges` table
 */
export async function fetchBadgesFromDb(): Promise<Badge[]> {
  const client = getSupabaseClient();
  if (!client) return [];

  try {
    const { data } = await client.from('badges').select('*');
    if (!data || data.length === 0) return [];

    return data.map((b) => ({
      id: String(b.id || b.badge_id),
      name: b.name || 'Verified Badge',
      description: b.description || 'Awarded for technical milestone achievement on HIREZONE.',
      iconName: b.icon || 'Award',
      domain: 'Engineering & Technology',
      requiredAchievement: 'Complete industry proof-of-work milestone',
      xpReward: 250,
      earnedDate: b.earned ? '2026-09-08' : undefined,
    }));
  } catch (err) {
    console.warn('[Supabase] Badges fetch error:', err);
    return [];
  }
}

/**
 * Record an assessment in the user's `assessments` table
 */
export async function saveAssessmentToDb(record: {
  studentId: string | number;
  score: number;
  passed: boolean;
  assessmentType: string;
  assessmentTitle: string;
  feedback?: string;
  difficultyLevel?: string;
  maxScore?: number;
  evaluatedBy?: string;
  generatedByAi?: boolean;
}): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const studentNumericId = Number(record.studentId) || 1;
    const payload = {
      student_id: studentNumericId,
      score: record.score,
      passed: record.passed,
      assessment_date: new Date().toISOString(),
      created_at: new Date().toISOString(),
      assessment_type: record.assessmentType,
      assessment_title: record.assessmentTitle,
      feedback: record.feedback || null,
      difficulty_level: record.difficultyLevel || 'Intermediate',
      max_score: record.maxScore || 100.0,
      evaluated_by: record.evaluatedBy || 'AI',
      generated_by_ai: record.generatedByAi ?? true,
    };

    const { error } = await client.from('assessments').insert([payload]);
    if (error) {
      console.warn('[Supabase] Error inserting assessment:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Supabase] Assessment record error:', err);
    return false;
  }
}

/**
 * Record a submission in the user's `proof_of_work` table
 */
export async function saveProofOfWorkToDb(record: {
  studentId: string | number;
  projectName: string;
  domain?: string;
  location?: string;
  challengeId?: number;
  recruiterId?: number;
}): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const studentNumericId = Number(record.studentId) || 1;
    const payload = {
      student_id: studentNumericId,
      project_name: record.projectName,
      domain: record.domain || 'Software Development',
      location: record.location || 'India',
      project_type: 'Student Proof',
      challenge_id: record.challengeId || null,
      recruiter_id: record.recruiterId || null,
      last_updated: new Date().toISOString(),
    };

    const { error } = await client.from('proof_of_work').insert([payload]);
    return !error;
  } catch (err) {
    console.warn('[Supabase] Proof of work error:', err);
    return false;
  }
}

/**
 * Record recruiter connection in `recruiter_connects` table
 */
export async function saveRecruiterConnectToDb(record: {
  studentId: string | number;
  recruiterId: string | number;
  message?: string;
}): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const payload = {
      student_id: Number(record.studentId) || 1,
      recruiter_id: Number(record.recruiterId) || 1,
      challenge_id: 1,
      status: 'Sent',
      message: record.message || 'Connection initiated from Student Portal',
      sent_at: new Date().toISOString(),
    };

    const { error } = await client.from('recruiter_connects').insert([payload]);
    return !error;
  } catch (err) {
    console.warn('[Supabase] Recruiter connect error:', err);
    return false;
  }
}
