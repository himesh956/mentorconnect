import {
  User,
  StudentProfile,
  MentorProfile,
  Booking,
  AvailabilitySlot,
  Roadmap,
  Review,
  NotificationItem,
  VerificationSubmission,
  PlatformReport,
  ChatMessage,
  Conversation,
  MatchScoreResult
} from '../../types/index.ts';

const API_BASE = '/api';

class ApiClient {
  private getHeaders(): Record<string, string> {
    const token = localStorage.getItem('mentorconnect_token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      headers['x-user-id'] = token;
    }
    return headers;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    const headers = { ...this.getHeaders(), ...((options.headers as any) || {}) };

    const res = await fetch(url, { ...options, headers });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || `HTTP ${res.status}: Request failed`);
    }

    return data;
  }

  // Auth
  async login(email: string): Promise<{ token: string; user: User }> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  }

  async register(payload: { name: string; email: string; role: string }): Promise<{ token: string; user: User }> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async getMe(): Promise<{ user: User; profile: StudentProfile | MentorProfile | null }> {
    return this.request('/auth/me');
  }

  // Student Profile & Dashboard
  async getStudentProfile(): Promise<{ profile: StudentProfile }> {
    return this.request('/students/profile');
  }

  async updateStudentProfile(profile: Partial<StudentProfile>): Promise<{ profile: StudentProfile }> {
    return this.request('/students/profile', {
      method: 'PUT',
      body: JSON.stringify(profile)
    });
  }

  async getStudentDashboard(): Promise<{ data: any }> {
    return this.request('/students/dashboard');
  }

  // Mentors & Discovery
  async getMentors(params?: {
    search?: string;
    domain?: string;
    college?: string;
    skill?: string;
    verifiedOnly?: boolean;
    minExp?: number;
    sort?: string;
  }): Promise<{ mentors: MentorProfile[] }> {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.domain) query.set('domain', params.domain);
    if (params?.college) query.set('college', params.college);
    if (params?.skill) query.set('skill', params.skill);
    if (params?.verifiedOnly) query.set('verifiedOnly', 'true');
    if (params?.minExp) query.set('minExp', String(params.minExp));
    if (params?.sort) query.set('sort', params.sort);

    return this.request(`/mentors?${query.toString()}`);
  }

  async getMentorById(id: string): Promise<{
    mentor: MentorProfile;
    availability: AvailabilitySlot[];
    reviews: Review[];
  }> {
    return this.request(`/mentors/${id}`);
  }

  async updateMentorProfile(profile: Partial<MentorProfile>): Promise<{ mentor: MentorProfile }> {
    return this.request('/mentors/profile', {
      method: 'PUT',
      body: JSON.stringify(profile)
    });
  }

  // Matching
  async getMentorMatches(): Promise<{
    matches: { mentor: MentorProfile; match: MatchScoreResult }[];
  }> {
    return this.request('/matching/mentors');
  }

  // Bookings
  async createBooking(booking: {
    mentorId: string;
    date: string;
    startTime: string;
    endTime: string;
    topic: string;
    notes?: string;
  }): Promise<{ booking: Booking }> {
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(booking)
    });
  }

  async getBookings(): Promise<{ bookings: Booking[] }> {
    return this.request('/bookings');
  }

  async updateBookingStatus(id: string, status: Booking['status']): Promise<{ booking: Booking }> {
    return this.request(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  }

  // Availability
  async getAvailability(mentorId: string): Promise<{ slots: AvailabilitySlot[] }> {
    return this.request(`/availability/${mentorId}`);
  }

  async addAvailability(slot: Partial<AvailabilitySlot>): Promise<{ slot: AvailabilitySlot }> {
    return this.request('/availability', {
      method: 'POST',
      body: JSON.stringify(slot)
    });
  }

  async deleteAvailability(id: string): Promise<{ success: boolean }> {
    return this.request(`/availability/${id}`, {
      method: 'DELETE'
    });
  }

  // Roadmap
  async getRoadmap(studentId?: string): Promise<{ roadmap: Roadmap }> {
    const q = studentId ? `?studentId=${studentId}` : '';
    return this.request(`/roadmap${q}`);
  }

  async addRoadmapTask(payload: any): Promise<{ roadmap: Roadmap }> {
    return this.request('/roadmap/tasks', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async updateRoadmapTaskStatus(roadmapId: string, taskId: string, status: string): Promise<{ roadmap: Roadmap }> {
    return this.request(`/roadmap/tasks/${taskId}`, {
      method: 'PATCH',
      body: JSON.stringify({ roadmapId, status })
    });
  }

  // Chat & Messages
  async getConversations(): Promise<{ conversations: Conversation[] }> {
    return this.request('/conversations');
  }

  async getMessages(conversationId: string): Promise<{ messages: ChatMessage[] }> {
    return this.request(`/conversations/${conversationId}/messages`);
  }

  async sendMessage(payload: {
    conversationId?: string;
    mentorId?: string;
    text: string;
  }): Promise<{ message: ChatMessage }> {
    return this.request('/messages', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  // Reviews
  async addReview(review: {
    bookingId?: string;
    mentorId: string;
    rating: number;
    comment: string;
  }): Promise<{ review: Review }> {
    return this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify(review)
    });
  }

  async getMentorReviews(mentorId: string): Promise<{ reviews: Review[] }> {
    return this.request(`/mentors/${mentorId}/reviews`);
  }

  // AI Services
  async analyzeCareer(profileData: any): Promise<{ analysis: any }> {
    return this.request('/ai/career-analysis', {
      method: 'POST',
      body: JSON.stringify(profileData)
    });
  }

  async askMentorAI(query: string): Promise<{ response: any }> {
    return this.request('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ query })
    });
  }

  // Verification & Admin
  async submitVerification(payload: any): Promise<{ verification: VerificationSubmission }> {
    return this.request('/verification', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async getAdminVerifications(): Promise<{ verifications: VerificationSubmission[] }> {
    return this.request('/admin/verifications');
  }

  async updateAdminVerification(id: string, status: string, adminNotes?: string): Promise<{ verification: VerificationSubmission }> {
    return this.request(`/admin/verifications/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, adminNotes })
    });
  }

  async getAdminStats(): Promise<{ stats: any }> {
    return this.request('/admin/stats');
  }

  async getAdminUsers(): Promise<{ users: User[] }> {
    return this.request('/admin/users');
  }

  async suspendUser(id: string, isSuspended: boolean): Promise<{ user: User }> {
    return this.request(`/admin/users/${id}/suspend`, {
      method: 'PATCH',
      body: JSON.stringify({ isSuspended })
    });
  }

  async getReports(): Promise<{ reports: PlatformReport[] }> {
    return this.request('/admin/reports');
  }

  async submitReport(payload: { reportedUserId: string; reason: string; details?: string }): Promise<{ report: PlatformReport }> {
    return this.request('/reports', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async getNotifications(): Promise<{ notifications: NotificationItem[] }> {
    return this.request('/notifications');
  }

  async markNotificationRead(id: string): Promise<{ success: boolean }> {
    return this.request(`/notifications/${id}/read`, {
      method: 'PATCH'
    });
  }
}

export const api = new ApiClient();
