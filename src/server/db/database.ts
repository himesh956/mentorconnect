import {
  User,
  StudentProfile,
  MentorProfile,
  VerificationSubmission,
  AvailabilitySlot,
  Booking,
  Roadmap,
  RoadmapTask,
  Review,
  NotificationItem,
  PlatformReport,
  ChatMessage,
  Conversation,
  SessionNote,
  SessionSummary
} from '../../types/index.ts';
import {
  SEED_USERS,
  SEED_STUDENT_PROFILES,
  SEED_MENTOR_PROFILES,
  SEED_VERIFICATIONS,
  SEED_AVAILABILITY,
  SEED_BOOKINGS,
  SEED_ROADMAP,
  SEED_REVIEWS,
  SEED_NOTIFICATIONS,
  SEED_CONVERSATIONS,
  SEED_MESSAGES,
  SEED_REPORTS
} from '../seedData.ts';

class DatabaseEngine {
  public users: Map<string, User> = new Map();
  public studentProfiles: Map<string, StudentProfile> = new Map();
  public mentorProfiles: Map<string, MentorProfile> = new Map();
  public verifications: Map<string, VerificationSubmission> = new Map();
  public availability: Map<string, AvailabilitySlot> = new Map();
  public bookings: Map<string, Booking> = new Map();
  public roadmaps: Map<string, Roadmap> = new Map();
  public reviews: Map<string, Review> = new Map();
  public notifications: Map<string, NotificationItem> = new Map();
  public conversations: Map<string, Conversation> = new Map();
  public messages: Map<string, ChatMessage> = new Map();
  public reports: Map<string, PlatformReport> = new Map();
  public sessionNotes: Map<string, SessionNote> = new Map();
  public sessionSummaries: Map<string, SessionSummary> = new Map();

  constructor() {
    this.seed();
  }

  public seed() {
    // Clear and reload
    this.users.clear();
    this.studentProfiles.clear();
    this.mentorProfiles.clear();
    this.verifications.clear();
    this.availability.clear();
    this.bookings.clear();
    this.roadmaps.clear();
    this.reviews.clear();
    this.notifications.clear();
    this.conversations.clear();
    this.messages.clear();
    this.reports.clear();
    this.sessionNotes.clear();
    this.sessionSummaries.clear();

    SEED_USERS.forEach(u => this.users.set(u.id, { ...u }));
    SEED_STUDENT_PROFILES.forEach(p => this.studentProfiles.set(p.id, { ...p }));
    SEED_MENTOR_PROFILES.forEach(m => this.mentorProfiles.set(m.id, { ...m }));
    SEED_VERIFICATIONS.forEach(v => this.verifications.set(v.id, { ...v }));
    SEED_AVAILABILITY.forEach(a => this.availability.set(a.id, { ...a }));
    SEED_BOOKINGS.forEach(b => this.bookings.set(b.id, { ...b }));
    this.roadmaps.set(SEED_ROADMAP.id, JSON.parse(JSON.stringify(SEED_ROADMAP)));
    SEED_REVIEWS.forEach(r => this.reviews.set(r.id, { ...r }));
    SEED_NOTIFICATIONS.forEach(n => this.notifications.set(n.id, { ...n }));
    SEED_CONVERSATIONS.forEach(c => this.conversations.set(c.id, { ...c }));
    SEED_MESSAGES.forEach(m => this.messages.set(m.id, { ...m }));
    SEED_REPORTS.forEach(r => this.reports.set(r.id, { ...r }));

    console.log(`[DatabaseEngine] Initialized with ${this.users.size} users, ${this.mentorProfiles.size} mentors, ${this.studentProfiles.size} students, and ${this.bookings.size} bookings.`);
  }

  // User queries
  public findUserByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find(
      u => u.email.toLowerCase() === email.toLowerCase()
    );
  }

  public findUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  public createUser(user: User): User {
    this.users.set(user.id, user);
    return user;
  }

  // Student profile queries
  public getStudentProfileByUserId(userId: string): StudentProfile | undefined {
    return Array.from(this.studentProfiles.values()).find(s => s.userId === userId);
  }

  public saveStudentProfile(profile: StudentProfile): StudentProfile {
    this.studentProfiles.set(profile.id, profile);
    return profile;
  }

  // Mentor profile queries
  public getMentorProfileById(id: string): MentorProfile | undefined {
    return this.mentorProfiles.get(id);
  }

  public getMentorProfileByUserId(userId: string): MentorProfile | undefined {
    return Array.from(this.mentorProfiles.values()).find(m => m.userId === userId);
  }

  public getAllMentors(filter?: {
    search?: string;
    domain?: string;
    college?: string;
    skill?: string;
    verifiedOnly?: boolean;
    minExp?: number;
  }): MentorProfile[] {
    let list = Array.from(this.mentorProfiles.values());

    if (filter) {
      if (filter.verifiedOnly) {
        list = list.filter(m => m.verificationStatus === 'VERIFIED');
      }
      if (filter.domain && filter.domain !== 'ALL') {
        const d = filter.domain.toLowerCase();
        list = list.filter(m =>
          m.targetDomains.some(td => td.toLowerCase().includes(d)) ||
          m.mentorshipCategories.some(mc => mc.toLowerCase().includes(d))
        );
      }
      if (filter.college && filter.college !== 'ALL') {
        const c = filter.college.toLowerCase();
        list = list.filter(m => m.college.toLowerCase().includes(c));
      }
      if (filter.skill) {
        const s = filter.skill.toLowerCase();
        list = list.filter(m => m.skills.some(sk => sk.toLowerCase().includes(s)));
      }
      if (filter.minExp) {
        list = list.filter(m => m.experienceYears >= (filter.minExp || 0));
      }
      if (filter.search) {
        const q = filter.search.toLowerCase();
        list = list.filter(m =>
          m.name.toLowerCase().includes(q) ||
          m.college.toLowerCase().includes(q) ||
          m.companyOrOrg.toLowerCase().includes(q) ||
          m.currentRole.toLowerCase().includes(q) ||
          m.skills.some(sk => sk.toLowerCase().includes(q)) ||
          m.mentorshipCategories.some(cat => cat.toLowerCase().includes(q))
        );
      }
    }
    return list;
  }

  public saveMentorProfile(profile: MentorProfile): MentorProfile {
    this.mentorProfiles.set(profile.id, profile);
    return profile;
  }

  // Availability queries
  public getMentorAvailability(mentorId: string): AvailabilitySlot[] {
    return Array.from(this.availability.values()).filter(a => a.mentorId === mentorId);
  }

  public saveAvailabilitySlot(slot: AvailabilitySlot): AvailabilitySlot {
    this.availability.set(slot.id, slot);
    return slot;
  }

  public deleteAvailabilitySlot(id: string): boolean {
    return this.availability.delete(id);
  }

  // Bookings & Double-Booking prevention
  public checkSlotConflict(mentorId: string, date: string, startTime: string): boolean {
    return Array.from(this.bookings.values()).some(
      b =>
        b.mentorId === mentorId &&
        b.date === date &&
        b.startTime === startTime &&
        (b.status === 'ACCEPTED' || b.status === 'REQUESTED')
    );
  }

  public createBooking(booking: Booking): { success: boolean; error?: string; booking?: Booking } {
    // Strict Anti-double-booking validation
    if (this.checkSlotConflict(booking.mentorId, booking.date, booking.startTime)) {
      return {
        success: false,
        error: `Slot ${booking.startTime} on ${booking.date} is already reserved by another student. Please select an available time.`
      };
    }
    this.bookings.set(booking.id, booking);
    return { success: true, booking };
  }

  public getBookingsForStudent(studentId: string): Booking[] {
    return Array.from(this.bookings.values())
      .filter(b => b.studentId === studentId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getBookingsForMentor(mentorId: string): Booking[] {
    return Array.from(this.bookings.values())
      .filter(b => b.mentorId === mentorId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getBookingById(id: string): Booking | undefined {
    return this.bookings.get(id);
  }

  public updateBookingStatus(id: string, status: Booking['status']): Booking | undefined {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;
    booking.status = status;
    if (status === 'ACCEPTED' && !booking.meetingLink) {
      booking.meetingLink = `room_${booking.id}`;
    }
    this.bookings.set(id, booking);
    return booking;
  }

  // Roadmap & Progress
  public getRoadmapByStudentId(studentId: string): Roadmap {
    let roadmap = Array.from(this.roadmaps.values()).find(r => r.studentId === studentId);
    if (!roadmap) {
      // Auto-generate starting roadmap
      roadmap = {
        id: `roadmap_${studentId}`,
        studentId,
        goal: 'Software Engineer Placement & Internship Roadmap',
        targetRole: 'Software Engineer',
        phases: [
          { phaseNumber: 1, phaseName: 'Foundations & Core Language', description: 'Core syntax, time complexity, and memory basics' },
          { phaseNumber: 2, phaseName: 'DSA Pattern Mastery', description: 'Two Pointers, Sliding Window, Trees, and DP' },
          { phaseNumber: 3, phaseName: 'Production Full Stack', description: 'Build end-to-end applications with tests and CI/CD' },
          { phaseNumber: 4, phaseName: 'System Design & OS', description: 'Database indexing, caching, and concurrency' },
          { phaseNumber: 5, phaseName: 'Mock Interviews & Hiring', description: 'Mentor mock rounds, resume reviews, and applications' }
        ],
        tasks: [
          {
            id: `task_${studentId}_1`,
            roadmapId: `roadmap_${studentId}`,
            phaseNumber: 1,
            phaseName: 'Foundations & Core Language',
            title: 'Master Time & Space Complexity (Big-O notation)',
            description: 'Analyze loop depths, recursion trees, and memory call stacks.',
            priority: 'HIGH',
            estimatedTime: '3 days',
            status: 'COMPLETED'
          },
          {
            id: `task_${studentId}_2`,
            roadmapId: `roadmap_${studentId}`,
            phaseNumber: 2,
            phaseName: 'DSA Pattern Mastery',
            title: 'Solve 25 Binary Tree & BFS/DFS problems',
            description: 'Traversals, Lowest Common Ancestor, and Tree serialization.',
            priority: 'HIGH',
            estimatedTime: '1 week',
            status: 'IN_PROGRESS'
          },
          {
            id: `task_${studentId}_3`,
            roadmapId: `roadmap_${studentId}`,
            phaseNumber: 3,
            phaseName: 'Production Full Stack',
            title: 'Build and deploy full-stack app with authentication',
            description: 'Implement JWT security and REST API endpoints.',
            priority: 'HIGH',
            estimatedTime: '2 weeks',
            status: 'TODO'
          }
        ],
        overallProgress: 33,
        updatedAt: new Date().toISOString()
      };
      this.roadmaps.set(roadmap.id, roadmap);
    }
    return roadmap;
  }

  public updateRoadmapTaskStatus(roadmapId: string, taskId: string, status: RoadmapTask['status']): Roadmap | undefined {
    const roadmap = this.roadmaps.get(roadmapId);
    if (!roadmap) return undefined;
    const task = roadmap.tasks.find(t => t.id === taskId);
    if (!task) return undefined;
    task.status = status;
    if (status === 'COMPLETED') {
      task.completedAt = new Date().toISOString();
    } else {
      task.completedAt = undefined;
    }

    // Recalculate overall progress
    const total = roadmap.tasks.length;
    const completed = roadmap.tasks.filter(t => t.status === 'COMPLETED').length;
    roadmap.overallProgress = total > 0 ? Math.round((completed / total) * 100) : 0;
    roadmap.updatedAt = new Date().toISOString();

    // Update student career readiness score in profile
    const studentProfile = this.getStudentProfileByUserId(roadmap.studentId);
    if (studentProfile) {
      studentProfile.careerReadinessScore = Math.min(98, Math.max(20, roadmap.overallProgress));
      this.saveStudentProfile(studentProfile);
    }

    this.roadmaps.set(roadmapId, roadmap);
    return roadmap;
  }

  public addRoadmapTask(roadmapId: string, task: RoadmapTask): Roadmap | undefined {
    const roadmap = this.roadmaps.get(roadmapId);
    if (!roadmap) return undefined;
    roadmap.tasks.push(task);
    const total = roadmap.tasks.length;
    const completed = roadmap.tasks.filter(t => t.status === 'COMPLETED').length;
    roadmap.overallProgress = Math.round((completed / total) * 100);
    roadmap.updatedAt = new Date().toISOString();
    this.roadmaps.set(roadmapId, roadmap);
    return roadmap;
  }

  // Reviews & Dynamic Ratings
  public addReview(review: Review): Review {
    this.reviews.set(review.id, review);
    // Recalculate mentor average rating
    const mentorReviews = Array.from(this.reviews.values()).filter(r => r.mentorId === review.mentorId);
    const mentor = this.mentorProfiles.get(review.mentorId);
    if (mentor) {
      const sum = mentorReviews.reduce((acc, r) => acc + r.rating, 0);
      mentor.rating = Number((sum / mentorReviews.length).toFixed(2));
      mentor.reviewsCount = mentorReviews.length;
      this.saveMentorProfile(mentor);
    }
    return review;
  }

  public getReviewsForMentor(mentorId: string): Review[] {
    return Array.from(this.reviews.values())
      .filter(r => r.mentorId === mentorId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Verification
  public getAllVerifications(): VerificationSubmission[] {
    return Array.from(this.verifications.values()).sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  }

  public getVerificationById(id: string): VerificationSubmission | undefined {
    return this.verifications.get(id);
  }

  public saveVerification(v: VerificationSubmission): VerificationSubmission {
    this.verifications.set(v.id, v);
    // Sync with mentor profile
    const mentor = this.mentorProfiles.get(v.mentorId);
    if (mentor) {
      mentor.verificationStatus = v.status;
      this.saveMentorProfile(mentor);
    }
    return v;
  }

  // Notifications
  public getNotificationsForUser(userId: string): NotificationItem[] {
    return Array.from(this.notifications.values())
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public createNotification(item: NotificationItem): NotificationItem {
    this.notifications.set(item.id, item);
    return item;
  }

  public markNotificationAsRead(id: string): boolean {
    const item = this.notifications.get(id);
    if (!item) return false;
    item.read = true;
    this.notifications.set(id, item);
    return true;
  }

  // Messages & Conversations
  public getOrCreateConversation(studentId: string, mentorId: string): Conversation {
    const existing = Array.from(this.conversations.values()).find(
      c => c.studentId === studentId && c.mentorId === mentorId
    );
    if (existing) return existing;

    const student = this.findUserById(studentId) || { name: 'Student' };
    const mentor = this.mentorProfiles.get(mentorId) || { name: 'Mentor' };

    const conv: Conversation = {
      id: `conv_${studentId}_${mentorId}`,
      studentId,
      studentName: student.name,
      mentorId,
      mentorName: mentor.name,
      unreadCountStudent: 0,
      unreadCountMentor: 0
    };
    this.conversations.set(conv.id, conv);
    return conv;
  }

  public getMessagesForConversation(convId: string): ChatMessage[] {
    return Array.from(this.messages.values())
      .filter(m => m.conversationId === convId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  public addMessage(msg: ChatMessage): ChatMessage {
    this.messages.set(msg.id, msg);
    const conv = this.conversations.get(msg.conversationId);
    if (conv) {
      conv.lastMessage = msg.text;
      conv.lastMessageTime = msg.timestamp;
      this.conversations.set(conv.id, conv);
    }
    return msg;
  }

  // Admin Stats
  public getAdminStats() {
    const allUsers = Array.from(this.users.values());
    const students = allUsers.filter(u => u.role === 'student');
    const mentors = Array.from(this.mentorProfiles.values());
    const verifiedMentors = mentors.filter(m => m.verificationStatus === 'VERIFIED');
    const pendingVerifications = Array.from(this.verifications.values()).filter(
      v => v.status === 'PENDING' || v.status === 'UNDER_REVIEW'
    );
    const allBookings = Array.from(this.bookings.values());
    const completedSessions = allBookings.filter(b => b.status === 'COMPLETED');
    const activeSessions = allBookings.filter(b => b.status === 'ACCEPTED');
    const reports = Array.from(this.reports.values());

    return {
      totalStudents: students.length,
      totalMentors: mentors.length,
      verifiedMentors: verifiedMentors.length,
      pendingVerifications: pendingVerifications.length,
      sessionsCompleted: completedSessions.length + 38, // including historical sessions
      activeSessions: activeSessions.length,
      totalReports: reports.length,
      categoryDistribution: [
        { name: 'Software Eng', value: 45 },
        { name: 'Placements & DSA', value: 38 },
        { name: 'AI & Data Science', value: 24 },
        { name: 'Higher Studies & GATE', value: 16 },
        { name: 'Consulting & MBA', value: 10 }
      ],
      sessionsByStatus: [
        { status: 'Completed', count: completedSessions.length + 38 },
        { status: 'Accepted / Scheduled', count: activeSessions.length },
        { status: 'Requested', count: allBookings.filter(b => b.status === 'REQUESTED').length }
      ],
      verificationFunnel: [
        { stage: 'Registered', count: mentors.length },
        { stage: 'Submitted', count: this.verifications.size },
        { stage: 'Under Review', count: pendingVerifications.filter(v => v.status === 'UNDER_REVIEW').length },
        { stage: 'Verified', count: verifiedMentors.length }
      ]
    };
  }
}

export const db = new DatabaseEngine();
