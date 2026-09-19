import {
  StudentProfile,
  StudentEnrollment,
  Company,
  Project,
  JobMarketTrend,
  NewsArticle,
  Recruiter,
  RecruiterInvitation,
  Badge,
  DescriptiveSubmission,
  AuthUser,
} from '../types';

const API_BASE = '/api';

function getStoredStudentId(): string | null {
  try {
    const userStr = localStorage.getItem('hirezone_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.id || user.studentId ? String(user.id || user.studentId) : null;
    }
  } catch {
    // Ignore storage parse errors
  }
  return null;
}

function getHeaders(customHeaders: Record<string, string> = {}): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };
  const studentId = getStoredStudentId();
  if (studentId) {
    headers['x-student-id'] = studentId;
  }
  const token = localStorage.getItem('hirezone_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Authentication & Supabase User Management
  async login(email: string, password?: string): Promise<{
    success: boolean;
    token: string;
    student: any;
    profile: StudentProfile;
    message?: string;
  }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Login failed. Please verify your email and password.');
    }
    return data;
  },

  async register(params: {
    name: string;
    email: string;
    password: string;
    college?: string;
    degree?: string;
    graduationYear?: string;
    phone?: string;
    location?: string;
  }): Promise<{
    success: boolean;
    token: string;
    student: any;
    profile: StudentProfile;
    message?: string;
  }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Registration failed. Please check your information.');
    }
    return data;
  },

  async getDemoAccounts(): Promise<{ accounts: Array<{ student_id: number; student_name: string; email: string; education: string; college: string }> }> {
    const res = await fetch(`${API_BASE}/auth/demo-accounts`);
    if (!res.ok) throw new Error('Failed to load demo accounts');
    return res.json();
  },

  async changePassword(oldPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ oldPassword, newPassword }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to update password');
    }
    return data;
  },

  async getMe(): Promise<{ user: AuthUser; profile: StudentProfile }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to verify session');
    return res.json();
  },

  async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  },

  async getDashboard(): Promise<{
    profile: StudentProfile;
    enrollment: StudentEnrollment;
    activeProject: Project;
    favouriteCompanies: Company[];
    stats: {
      asScore: number;
      projectsCompleted: number;
      skillsCompleted: number;
      badgesEarned: number;
      careerJourneyProgress: number;
      recruiterConnections: number;
      totalXp: number;
    };
  }> {
    const res = await fetch(`${API_BASE}/student/dashboard`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load dashboard data');
    return res.json();
  },

  async getTrends(): Promise<{ trends: JobMarketTrend[]; sampleDataNotice: string }> {
    const res = await fetch(`${API_BASE}/trends`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load market trends');
    return res.json();
  },

  async getNews(): Promise<{ articles: NewsArticle[] }> {
    const res = await fetch(`${API_BASE}/news`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load news');
    return res.json();
  },

  async getCompanies(filters?: { category?: string; type?: string; search?: string }): Promise<{ companies: Company[] }> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.search) params.append('search', filters.search);

    const res = await fetch(`${API_BASE}/companies?${params.toString()}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch companies');
    return res.json();
  },

  async toggleFavouriteCompany(id: string, currentlyFavourite: boolean): Promise<{ favouriteCompanyIds: string[] }> {
    const method = currentlyFavourite ? 'DELETE' : 'POST';
    const res = await fetch(`${API_BASE}/companies/${id}/favourite`, {
      method,
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to update favourite company');
    return res.json();
  },

  async getProjects(filters?: { domain?: string; difficulty?: string; search?: string; company?: string }): Promise<{ projects: Project[] }> {
    const params = new URLSearchParams();
    if (filters?.domain) params.append('domain', filters.domain);
    if (filters?.difficulty) params.append('difficulty', filters.difficulty);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.company) params.append('company', filters.company);

    const res = await fetch(`${API_BASE}/projects?${params.toString()}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch projects');
    return res.json();
  },

  async getProject(id: string): Promise<{ project: Project }> {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch project');
    return res.json();
  },

  async enrollInProject(projectId: string, companyId?: string): Promise<{ success: boolean; enrollment: StudentEnrollment }> {
    const res = await fetch(`${API_BASE}/projects/${projectId}/enroll`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ companyId }),
    });
    if (!res.ok) throw new Error('Failed to enroll in project');
    return res.json();
  },

  async getActiveJourney(): Promise<{ activeJourney: StudentEnrollment; project: Project }> {
    const res = await fetch(`${API_BASE}/student/journeys`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch active journey');
    return res.json();
  },

  async updateJourneyProgress(
    journeyId: string,
    data: { stageId: string; nextStageId?: string }
  ): Promise<{ success: boolean; journey: StudentEnrollment }> {
    const res = await fetch(`${API_BASE}/student/journeys/${journeyId}/progress`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update journey progress');
    return res.json();
  },

  async completeTask(taskId: string, xpReward: number): Promise<{ success: boolean; completedTaskIds: string[]; totalXp: number }> {
    const res = await fetch(`${API_BASE}/student/tasks/${taskId}/complete`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ xpReward }),
    });
    if (!res.ok) throw new Error('Failed to complete task');
    return res.json();
  },

  async submitMCQAttempt(data: {
    stageId: string;
    score: number;
    totalQuestions: number;
    answers: { [qId: string]: number };
  }): Promise<{ success: boolean; canContinue: boolean; xpAwarded: number; message: string }> {
    const res = await fetch(`${API_BASE}/mcq-attempts`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to record MCQ attempt');
    return res.json();
  },

  async submitDescriptiveAnswer(data: {
    projectId: string;
    answerText: string;
    githubUrl?: string;
    demoUrl?: string;
    notes?: string;
  }): Promise<{ success: boolean; submission: DescriptiveSubmission; message: string }> {
    const res = await fetch(`${API_BASE}/descriptive-submissions`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Submission failed' }));
      throw new Error(err.error || 'Failed to submit descriptive assessment');
    }
    return res.json();
  },

  async getProfile(): Promise<{ profile: StudentProfile }> {
    const res = await fetch(`${API_BASE}/student/profile`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load profile');
    return res.json();
  },

  async updateProfile(updates: Partial<StudentProfile>): Promise<{ success: boolean; profile: StudentProfile }> {
    const res = await fetch(`${API_BASE}/student/profile`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  },

  async getRecruiters(): Promise<{ recruiters: Recruiter[] }> {
    const res = await fetch(`${API_BASE}/recruiters`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch recruiters');
    return res.json();
  },

  async connectWithRecruiter(recruiterId: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/connections`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ recruiterId }),
    });
    if (!res.ok) throw new Error('Failed to send connection request');
    return res.json();
  },

  async getInvitations(): Promise<{ invitations: RecruiterInvitation[] }> {
    const res = await fetch(`${API_BASE}/invitations`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch invitations');
    return res.json();
  },

  async respondToInvitation(id: string, status: 'accepted' | 'declined'): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/invitations/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to respond to invitation');
    return res.json();
  },

  async getBadges(): Promise<{ earned: Badge[]; available: Badge[] }> {
    const res = await fetch(`${API_BASE}/student/badges`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch badges');
    return res.json();
  },
};
