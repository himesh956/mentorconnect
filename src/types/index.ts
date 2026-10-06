export type UserRole = 'student' | 'mentor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  role: UserRole;
  avatarUrl: string;
  createdAt: string;
  isSuspended?: boolean;
}

export interface StudentProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  age: number;
  education: string;
  college: string;
  degree: string;
  branch: string;
  yearOrSemester: string;
  skills: string[];
  interests: string[];
  targetCareer: string;
  targetCompanies: string[];
  targetExams: string[];
  preferredDomain: string;
  currentSkillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  availability: string;
  careerGoals: string;
  currentProblems: string;
  careerReadinessScore: number;
  aiProfileSummary?: {
    careerDirection: string;
    recommendedSkillAreas: string[];
    suggestedMentorType: string;
    shortTermGoals: string[];
    longTermGoals: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export type VerificationStatus = 'PENDING' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED';

export interface MentorProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatarUrl: string;
  college: string;
  degree: string;
  graduationYear: number;
  currentRole: string;
  companyOrOrg: string;
  experienceYears: number;
  skills: string[];
  areasOfExpertise: string[];
  mentorshipCategories: string[];
  targetDomains: string[];
  examsHandled: string[];
  languages: string[];
  bio: string;
  verificationStatus: VerificationStatus;
  verificationDocUrl?: string;
  collegeEmail?: string;
  studentOrAlumniId?: string;
  rating: number;
  reviewsCount: number;
  sessionsCompleted: number;
  hourlyRate?: number; // 0 for free/volunteer
  availabilityDescription: string;
  createdAt: string;
  updatedAt: string;
}

export interface VerificationSubmission {
  id: string;
  mentorId: string;
  mentorName: string;
  college: string;
  collegeEmail: string;
  studentOrAlumniId: string;
  graduationYear: number;
  currentRole: string;
  documentUrl: string;
  status: VerificationStatus;
  confidenceScore: number;
  extractedDetails?: {
    extractedName: string;
    extractedCollege: string;
    extractedId: string;
    extractedYear: string;
    matchNotes: string;
  };
  adminNotes?: string;
  submittedAt: string;
  reviewedAt?: string;
}

export interface AvailabilitySlot {
  id: string;
  mentorId: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime: string; // e.g. "18:00"
  endTime: string;   // e.g. "19:00"
  isBooked?: boolean;
}

export type BookingStatus = 'REQUESTED' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';

export interface Booking {
  id: string;
  studentId: string;
  studentName: string;
  mentorId: string;
  mentorName: string;
  mentorRole: string;
  mentorCompany: string;
  date: string; // YYYY-MM-DD
  startTime: string; // e.g. "18:00"
  endTime: string;   // e.g. "19:00"
  topic: string;
  notes?: string;
  status: BookingStatus;
  meetingLink?: string;
  createdAt: string;
}

export interface SessionNote {
  id: string;
  sessionId: string;
  mentorId: string;
  studentId: string;
  privateNotes: string;
  weakAreas: string[];
  recommendedAction: string;
  createdAt: string;
}

export interface SessionSummary {
  id: string;
  bookingId: string;
  studentId: string;
  mentorId: string;
  summaryText: string;
  keyProblemsDiscussed: string[];
  recommendedResources: { title: string; url: string }[];
  actionItems: string[];
  nextSessionGoal: string;
  createdAt: string;
}

export interface RoadmapTask {
  id: string;
  roadmapId: string;
  phaseNumber: number;
  phaseName: string;
  title: string;
  description: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  estimatedTime: string;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  completedAt?: string;
}

export interface Roadmap {
  id: string;
  studentId: string;
  goal: string;
  targetRole: string;
  phases: {
    phaseNumber: number;
    phaseName: string;
    description: string;
  }[];
  tasks: RoadmapTask[];
  overallProgress: number; // 0 - 100%
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  studentId: string;
  studentName: string;
  mentorId: string;
  mentorName: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCountStudent: number;
  unreadCountMentor: number;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'BOOKING_REQUEST' | 'BOOKING_ACCEPTED' | 'BOOKING_REJECTED' | 'SESSION_UPCOMING' | 'NEW_MESSAGE' | 'VERIFICATION_UPDATE' | 'ACTION_ITEM' | 'REVIEW_RECEIVED';
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  bookingId: string;
  mentorId: string;
  studentId: string;
  studentName: string;
  studentCollege: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}

export interface PlatformReport {
  id: string;
  reporterId: string;
  reporterName: string;
  reporterRole: UserRole;
  reportedUserId: string;
  reportedUserName: string;
  reason: string;
  details: string;
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
  createdAt: string;
}

export interface MatchScoreResult {
  mentorId: string;
  score: number; // 0 - 100
  reasons: string[];
  matchedSkills: string[];
  matchedGoals: string[];
  matchedCategories: string[];
  careerMatchPercent: number;
  skillMatchPercent: number;
  experienceMatchPercent: number;
  availabilityMatchPercent: number;
  collegeMatchPercent: number;
}
