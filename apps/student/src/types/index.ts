export type DomainType =
  | 'Artificial Intelligence'
  | 'Machine Learning'
  | 'Data Science'
  | 'Software Development'
  | 'Cloud Computing'
  | 'Cybersecurity'
  | 'Robotics'
  | 'Embedded Systems'
  | 'Internet of Things'
  | 'Electronics'
  | 'Semiconductor Technology'
  | 'Data Engineering'
  | 'DevOps'
  | 'Product Design'
  | 'Computer Vision'
  | 'Hardware Architecture'
  | 'Wireless Protocols'
  | 'Automotive'
  | 'Aerospace'
  | 'Industrial Automation'
  | 'Autonomous Systems'
  | 'FinTech';

export type CompanyCategory =
  | 'Software'
  | 'Hardware'
  | 'Semiconductor'
  | 'Robotics'
  | 'Automotive'
  | 'Aerospace'
  | 'IT Services'
  | 'Product Company'
  | 'Research'
  | 'Government Technology'
  | 'Industrial Automation'
  | 'Cloud Infrastructure'
  | 'E-Commerce & Retail'
  | 'AI & Enterprise Software'
  | 'Computer Vision & Semiconductors'
  | 'Automotive & Autonomous Systems'
  | 'FinTech & Quantitative Finance';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Company {
  id: string;
  name: string;
  category: CompanyCategory;
  type: 'Software' | 'Hardware' | 'Hybrid';
  headquarters: string;
  description: string;
  focusDomains: DomainType[];
  inDemandSkills: string[];
  isFavourite?: boolean;
}

export interface LearningResource {
  id: string;
  title: string;
  provider: 'NPTEL' | 'Coursera' | 'Official Documentation' | 'Microsoft Learn' | 'AWS Skill Builder' | 'Google Cloud Skills' | 'Swayam' | 'IIT Lecture Series';
  topic: string;
  skillCovered: string;
  level: DifficultyLevel;
  estimatedDuration: string;
  url: string;
  isOfficial: boolean;
  institution?: string;
  instructor?: string;
  syllabusHighlights?: string[];
  swayamUrl?: string;
  videoUrl?: string;
}

export interface RoadmapTask {
  id: string;
  title: string;
  objective: string;
  explanation: string;
  requiredSkills: string[];
  requiredTools: string[];
  instructions: string[];
  expectedOutput: string;
  checklist: string[];
  hints?: string[];
  difficulty: DifficultyLevel;
  xpReward: number;
}

export interface MCQQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // 0-3 index
  explanation: string;
  topic: string;
  difficulty: DifficultyLevel;
}

export interface MCQAttempt {
  stageId: string;
  score: number;
  totalQuestions: number;
  answers: { [questionId: string]: number };
  timestamp: string;
  passed: boolean; // Always true because 1/5 continues!
}

export interface RoadmapStage {
  id: string;
  stageNumber: number;
  title: string;
  shortDescription: string;
  type: 'concept' | 'skill_learning' | 'guided_task' | 'core_build' | 'test_improve' | 'final_challenge';
  task?: RoadmapTask;
  learningResources?: LearningResource[];
  mcqs?: MCQQuestion[];
  xpReward: number;
}

export interface Project {
  id: string;
  title: string;
  companyName?: string;
  domain: DomainType;
  industryCategory: CompanyCategory;
  difficulty: DifficultyLevel;
  estimatedDuration: string;
  description: string;
  requiredSkills: string[];
  recommendedCompanies: string[];
  hardwareRequirements?: string[];
  softwareRequirements: string[];
  expectedOutput: string;
  stages: RoadmapStage[];
  descriptiveQuestionPrompt: string;
}

export interface AIEvaluation {
  overallScore: number;
  score?: number;
  technicalUnderstandingScore: number;
  projectKnowledgeScore: number;
  problemSolvingScore: number;
  clarityScore: number;
  strengths: string[];
  weaknesses: string[];
  suggestedImprovements: string[];
  feedback: string;
  evaluatedAt: string;
  isFallback?: boolean;
}

export interface DescriptiveSubmission {
  id: string;
  projectId: string;
  studentId: string;
  question: string;
  answerText: string;
  githubUrl?: string;
  demoUrl?: string;
  notes?: string;
  submittedAt: string;
  evaluation?: AIEvaluation;
  status: 'submitted' | 'evaluated' | 'pending';
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconName: string;
  domain: string;
  requiredAchievement: string;
  xpReward: number;
  earnedDate?: string;
}

export interface StudentEnrollment {
  id: string;
  studentId: string;
  projectId: string;
  companyId?: string;
  startDate: string;
  currentStageId: string;
  completedStageIds: string[];
  completedTaskIds: string[];
  completionPercentage: number;
  totalXpEarned: number;
  mcqScores: { [stageId: string]: { score: number; total: number } };
  descriptiveSubmissionId?: string;
  descriptiveScore?: number;
  overallScore?: number;
  earnedBadgeIds: string[];
  status: 'in_progress' | 'completed';
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  college: string;
  degree: string;
  graduationYear: string;
  avatarUrl: string;
  asScore: number; // Academic & Skill score (0 - 100)
  totalXp: number;
  skills: string[];
  domains: DomainType[];
  favouriteCompanyIds: string[];
  activeEnrollmentId?: string;
  completedProjectCount: number;
  bio?: string;
  githubUrl: string;
  linkedinUrl: string;
  resumeUrl: string;
  portfolioUrl: string;
  permitRecruiterVisibility: boolean;
  permitGovtVerification: boolean;
}

export interface Recruiter {
  id: string;
  name: string;
  designation: string;
  company: string;
  industry: string;
  avatarUrl: string;
  mutualInterests: string[];
  hiringDomains: DomainType[];
  connectionStatus: 'none' | 'pending_sent' | 'connected' | 'invitation_received';
  location: string;
}

export interface RecruiterInvitation {
  id: string;
  recruiterId: string;
  recruiterName: string;
  company: string;
  roleTitle: string;
  message: string;
  sentDate: string;
  status: 'pending' | 'accepted' | 'declined';
  domain: DomainType;
}

export interface JobMarketTrend {
  domain: DomainType;
  growthPercentage: number;
  demandLevel: 'Very High' | 'High' | 'Rising' | 'Steady';
  openRolesEstimate: number;
  topDemandedSkills: string[];
  isVerifiedReport: boolean;
  sampleDataSource: string;
}

export interface NewsArticle {
  id: string;
  headline: string;
  summary: string;
  sourceName: string;
  publicationDate: string;
  relatedDomain: DomainType;
  relevantSkills: string[];
  originalUrl: string;
  isVerified: boolean;
  content?: string;
  keyTakeaways?: string[];
  author?: string;
  readTime?: string;
}

export interface AuthUser {
  id: string;
  studentId: number;
  name: string;
  email: string;
  role: 'student';
  college?: string;
  degree?: string;
  graduationYear?: string;
  token?: string;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  accentColor: 'blue' | 'indigo' | 'emerald' | 'violet' | 'amber' | 'rose' | 'cyan';
  density: 'comfortable' | 'compact';
  emailNotifications: boolean;
  recruiterDiscovery: boolean;
  autoSaveProgress: boolean;
  soundEffects?: boolean;
}
