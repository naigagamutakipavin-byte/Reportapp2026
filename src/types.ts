/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CallLog {
  id: string;
  timestamp: string;
  type: 'incoming' | 'outgoing';
  phoneNumber: string;
  contactName?: string;
  notes: string;
  isImportant: boolean;
}

export interface GuestLog {
  id: string;
  timestamp: string;
  guestName?: string;
  purpose: string;
  count: number;
}

export interface EnrollmentLog {
  id: string;
  timestamp: string;
  studentName: string;
  program: string;
  status: 'Completed' | 'Pending';
}

export interface InquiryLog {
  id: string;
  timestamp: string;
  inquirerName?: string;
  type: string; // e.g., Pricing, Enrollment, Schedule, General
  details: string;
  status: 'Resolved' | 'Pending';
}

export interface FollowUpTask {
  id: string;
  title: string;
  dueDate: string; // YYYY-MM-DD
  completed: boolean;
  notes?: string;
}

export interface DailyNotes {
  challenges: string;
  achievements: string;
  observations: string;
  aiSummary?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  department: string;
  companyName: string;
}

export interface DailyReportState {
  date: string; // YYYY-MM-DD
  calls: CallLog[];
  guests: GuestLog[];
  enrollments: EnrollmentLog[];
  inquiries: InquiryLog[];
  tasks: FollowUpTask[];
  notes: DailyNotes;
}
