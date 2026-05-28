// ═══════════════════════════════════════════════════════════════
//  Competition & Anti-Cheat Types
// ═══════════════════════════════════════════════════════════════

export type QuestionType =
  | "mcq"
  | "multiple_select"
  | "true_false"
  | "short_answer"
  | "essay"
  | "code"
  | "fill_in_blank"
  | "matching";

export interface CompetitionQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer?: string | string[];
  points: number;
  timeLimit?: number; // seconds per question
  imageUrl?: string;
}

export interface CompetitionRules {
  id: string;
  title: string;
  description: string;
  duration: number; // minutes
  totalQuestions: number;
  passingScore: number;
  maxViolations: number;
  tabSwitchWarning: boolean;
  cameraRequired: boolean;
  fullscreenRequired: boolean;
  randomizeQuestions: boolean;
  showResults: boolean;
  startTime?: string;
  endTime?: string;
}

export interface CompetitionSession {
  id: string;
  userId: string;
  userName: string;
  competitionId: string;
  status: "active" | "submitted" | "disqualified" | "completed";
  startedAt: string;
  submittedAt?: string;
  violations: ViolationEvent[];
  answers: Record<string, string | string[]>;
  score?: number;
  totalPoints: number;
  disqualificationReason?: string;
}

export interface ViolationEvent {
  id: string;
  type: "tab_switch" | "fullscreen_exit" | "copy_paste" | "right_click" | "camera_off" | "face_not_visible" | "multiple_faces" | "screenshot" | "window_blur";
  timestamp: string;
  details?: string;
  count: number;
}

export interface JudgeScore {
  id: string;
  sessionId: string;
  judgeId: string;
  questionId: string;
  score: number;
  feedback?: string;
  scoredAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  sessionId: string;
  userName: string;
  score: number;
  totalPoints: number;
  percentage: number;
  completedAt: string;
  violations: number;
  status: string;
}

export interface SubmissionForJudging {
  id: string;
  userName: string;
  competitionTitle: string;
  submittedAt: string;
  score: number;
  totalPoints: number;
  status: string;
  answers: Array<{
    questionId: string;
    question: string;
    type: QuestionType;
    answer: string | string[];
    maxPoints: number;
    autoScore?: number;
    judgeScore?: number;
    judgeFeedback?: string;
  }>;
}

// Admin/CMS types
export interface SiteColorConfig {
  primary: string;      // gold
  primaryLight: string;
  background: string;   // void
  surface: string;
  raised: string;
  cream: string;        // text primary
  muted: string;        // text secondary
  subtle: string;       // text tertiary
  border: string;
  borderHover: string;
  success: string;
  error: string;
}

export interface AdviserFormData {
  id?: string;
  name: string;
  title: string;
  company: string;
  bio: string;
  expertise: string[];
  imageUrl: string;
  linkedInUrl: string;
  twitterUrl: string;
  websiteUrl: string;
  category: string;
  displayOrder: number;
  featured: boolean;
  published: boolean;
}
