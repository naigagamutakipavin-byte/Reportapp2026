/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import AuthScreen from './components/AuthScreen';
import Dashboard from './components/Dashboard';
import ActivityLogger from './components/ActivityLogger';
import TaskList from './components/TaskList';
import ReportView from './components/ReportView';
import UserProfileComponent from './components/UserProfile';
import { CallLog, GuestLog, EnrollmentLog, InquiryLog, FollowUpTask, DailyNotes, UserProfile } from './types';

// Mock Seed Data for instant preview gratification
const SEED_USER: UserProfile = {
  name: 'Andrew Mike',
  email: 'andrew.mike@school.edu',
  role: 'Enrollment Officer',
  department: 'Admissions Office',
  companyName: 'Global Education Institute',
};

const SEED_CALLS: CallLog[] = [
  { id: 'c1', timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), type: 'outgoing', phoneNumber: '+1 (555) 019-8831', contactName: 'Alice Cooper', notes: 'Discussed CS bachelor document upload requirements. She will submit high school transcripts today.', isImportant: true },
  { id: 'c2', timestamp: new Date(Date.now() - 3600000 * 4).toISOString(), type: 'incoming', phoneNumber: '+1 (555) 014-9922', contactName: 'Thomas Jefferson', notes: 'Inquired about MBA weekend track registration fees and flexible payments.', isImportant: false },
  { id: 'c3', timestamp: new Date(Date.now() - 3600000 * 5).toISOString(), type: 'outgoing', phoneNumber: '+1 (555) 012-7711', contactName: 'Sarah Connor', notes: 'Scheduled a campus tour for next Monday afternoon.', isImportant: false },
];

const SEED_GUESTS: GuestLog[] = [
  { id: 'g1', timestamp: new Date(Date.now() - 3600000 * 1).toISOString(), guestName: 'Dr. Arthur Pendragon', purpose: 'Campus Tour', count: 2 },
  { id: 'g2', timestamp: new Date(Date.now() - 3600000 * 3).toISOString(), guestName: 'Genevieve Vance', purpose: 'Document Submission', count: 1 },
];

const SEED_ENROLLMENTS: EnrollmentLog[] = [
  { id: 'e1', timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(), studentName: 'Alice Cooper', program: 'AI', status: 'Completed' },
  { id: 'e2', timestamp: new Date(Date.now() - 3600000 * 6).toISOString(), studentName: 'Bob Vance', program: 'AI', status: 'Pending' },
];

const SEED_INQUIRIES: InquiryLog[] = [
  { id: 'i1', timestamp: new Date(Date.now() - 3600000 * 0.5).toISOString(), inquirerName: 'Marcus Aurelius', type: 'Pricing & Fees', details: 'Wants detailed prospectus of scholarships for international students.', status: 'Pending' },
  { id: 'i2', timestamp: new Date(Date.now() - 3600000 * 3).toISOString(), inquirerName: 'Cleopatra Selene', type: 'Admission Requirements', details: 'Checked eligibility with a non-traditional educational background.', status: 'Resolved' },
];

const SEED_TASKS: FollowUpTask[] = [
  { id: 't1', title: 'Verify Alice Cooper high school transcripts', dueDate: new Date().toISOString().split('T')[0], completed: true, notes: 'Completed at 11:30 AM' },
  { id: 't2', title: 'Draft admissions syllabus guide for fall classes', dueDate: new Date().toISOString().split('T')[0], completed: false, notes: 'Awaiting curriculum approvals' },
  { id: 't3', title: 'Call Marcus Aurelius with scholarship decisions', dueDate: new Date().toISOString().split('T')[0], completed: false, notes: 'Needs approval from Dean' },
  { id: 't4', title: 'Review continuing studies online portal queries', dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], completed: false },
];

const SEED_NOTES: DailyNotes = {
  challenges: 'High traffic during mid-day admissions caused slight lags in the enrollment system.',
  achievements: 'Enrolled Alice Cooper in Computer Science. Reached 92% admissions target for the local student demographic.',
  observations: 'High student interest in Master of Business Administration weekend programs. Recommended social media advertising boost.',
  aiSummary: 'Today showed robust performance in candidate engagement, highlighted by the successful enrollment of Alice Cooper in the computer science program. We also resolved critical eligibility queries from Cleopatra Selene. However, mid-day system latency during heavy traffic remains a minor challenge. Attention should turn to high-interest MBA prospects tomorrow.',
};

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('reporter_user');
    return saved ? JSON.parse(saved) : null; // Use saved profile, or default to null so user can enter their own details
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'logs' | 'tasks' | 'reports' | 'profile'>('dashboard');
  const [activeSubTab, setActiveSubTab] = useState<'call' | 'guest' | 'enrollment' | 'inquiry' | 'notes'>('call');

  // Logs States with persistence
  const [calls, setCalls] = useState<CallLog[]>(() => {
    const saved = localStorage.getItem('reporter_calls');
    return saved ? JSON.parse(saved) : SEED_CALLS;
  });

  const [guests, setGuests] = useState<GuestLog[]>(() => {
    const saved = localStorage.getItem('reporter_guests');
    return saved ? JSON.parse(saved) : SEED_GUESTS;
  });

  const [enrollments, setEnrollments] = useState<EnrollmentLog[]>(() => {
    const saved = localStorage.getItem('reporter_enrollments');
    return saved ? JSON.parse(saved) : SEED_ENROLLMENTS;
  });

  const [inquiries, setInquiries] = useState<InquiryLog[]>(() => {
    const saved = localStorage.getItem('reporter_inquiries');
    return saved ? JSON.parse(saved) : SEED_INQUIRIES;
  });

  const [tasks, setTasks] = useState<FollowUpTask[]>(() => {
    const saved = localStorage.getItem('reporter_tasks');
    return saved ? JSON.parse(saved) : SEED_TASKS;
  });

  const [dailyNotes, setDailyNotes] = useState<DailyNotes>(() => {
    const saved = localStorage.getItem('reporter_notes');
    return saved ? JSON.parse(saved) : SEED_NOTES;
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('reporter_dark');
    return saved === 'true';
  });

  // Persist state updates
  useEffect(() => {
    if (user) localStorage.setItem('reporter_user', JSON.stringify(user));
    else localStorage.removeItem('reporter_user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('reporter_calls', JSON.stringify(calls));
  }, [calls]);

  useEffect(() => {
    localStorage.setItem('reporter_guests', JSON.stringify(guests));
  }, [guests]);

  useEffect(() => {
    localStorage.setItem('reporter_enrollments', JSON.stringify(enrollments));
  }, [enrollments]);

  useEffect(() => {
    localStorage.setItem('reporter_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  useEffect(() => {
    localStorage.setItem('reporter_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('reporter_notes', JSON.stringify(dailyNotes));
  }, [dailyNotes]);

  // Dark Mode toggler
  useEffect(() => {
    localStorage.setItem('reporter_dark', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogin = (profile: UserProfile) => {
    setUser(profile);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('reporter_user');
  };

  // Add handlers
  const handleAddCall = (call: Omit<CallLog, 'id' | 'timestamp'> & { timestamp?: string }) => {
    const newCall: CallLog = {
      ...call,
      id: `c_${Date.now()}`,
      timestamp: call.timestamp || new Date().toISOString(),
    };
    setCalls([newCall, ...calls]);
  };

  const handleEditCall = (id: string, updatedFields: Partial<CallLog>) => {
    setCalls(calls.map(c => c.id === id ? { ...c, ...updatedFields } : c));
  };

  const handleEditInquiry = (id: string, updatedFields: Partial<InquiryLog>) => {
    setInquiries(inquiries.map(i => i.id === id ? { ...i, ...updatedFields } : i));
  };

  const handleAddGuest = (guest: Omit<GuestLog, 'id' | 'timestamp'> & { timestamp?: string }) => {
    const newGuest: GuestLog = {
      ...guest,
      id: `g_${Date.now()}`,
      timestamp: guest.timestamp || new Date().toISOString(),
    };
    setGuests([newGuest, ...guests]);
  };

  const handleEditGuest = (id: string, updatedFields: Partial<GuestLog>) => {
    setGuests(guests.map(g => g.id === id ? { ...g, ...updatedFields } : g));
  };

  const handleAddEnrollment = (enrollment: Omit<EnrollmentLog, 'id' | 'timestamp'> & { timestamp?: string }) => {
    const newEnrollment: EnrollmentLog = {
      ...enrollment,
      id: `e_${Date.now()}`,
      timestamp: enrollment.timestamp || new Date().toISOString(),
    };
    setEnrollments([newEnrollment, ...enrollments]);
  };

  const handleEditEnrollment = (id: string, updatedFields: Partial<EnrollmentLog>) => {
    setEnrollments(enrollments.map(e => e.id === id ? { ...e, ...updatedFields } : e));
  };

  const handleAddInquiry = (inquiry: Omit<InquiryLog, 'id' | 'timestamp'> & { timestamp?: string }) => {
    const newInquiry: InquiryLog = {
      ...inquiry,
      id: `i_${Date.now()}`,
      timestamp: inquiry.timestamp || new Date().toISOString(),
    };
    setInquiries([newInquiry, ...inquiries]);
  };

  const handleAddTask = (task: Omit<FollowUpTask, 'id' | 'completed'>) => {
    const newTask: FollowUpTask = {
      ...task,
      id: `t_${Date.now()}`,
      completed: false,
    };
    setTasks([newTask, ...tasks]);
  };

  const handleToggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleEditTask = (id: string, updatedFields: Partial<Omit<FollowUpTask, 'id'>>) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, ...updatedFields } : t));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleDeleteLog = (category: 'calls' | 'guests' | 'enrollments' | 'inquiries', id: string) => {
    if (category === 'calls') setCalls(calls.filter(c => c.id !== id));
    if (category === 'guests') setGuests(guests.filter(g => g.id !== id));
    if (category === 'enrollments') setEnrollments(enrollments.filter(e => e.id !== id));
    if (category === 'inquiries') setInquiries(inquiries.filter(i => i.id !== id));
  };

  // Quick Action menu callback
  const handleQuickAction = (actionType: 'call' | 'guest' | 'enrollment' | 'inquiry' | 'task') => {
    if (actionType === 'task') {
      setActiveTab('tasks');
    } else {
      setActiveTab('logs');
      setActiveSubTab(actionType === 'enrollment' ? 'enrollment' : actionType as any);
    }
  };

  if (!user) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <Layout
      user={user}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onQuickAction={handleQuickAction}
    >
      {activeTab === 'dashboard' && (
        <Dashboard
          user={user}
          calls={calls}
          guests={guests}
          enrollments={enrollments}
          inquiries={inquiries}
          tasks={tasks}
          onTabChange={setActiveTab}
          onQuickAction={handleQuickAction}
        />
      )}

      {activeTab === 'logs' && (
        <ActivityLogger
          calls={calls}
          guests={guests}
          enrollments={enrollments}
          inquiries={inquiries}
          dailyNotes={dailyNotes}
          onAddCall={handleAddCall}
          onAddGuest={handleAddGuest}
          onAddEnrollment={handleAddEnrollment}
          onAddInquiry={handleAddInquiry}
          onUpdateDailyNotes={setDailyNotes}
          onDeleteLog={handleDeleteLog}
          onEditCall={handleEditCall}
          onEditInquiry={handleEditInquiry}
          onEditEnrollment={handleEditEnrollment}
          onEditGuest={handleEditGuest}
          initialActiveSubTab={activeSubTab}
        />
      )}

      {activeTab === 'tasks' && (
        <TaskList
          tasks={tasks}
          onAddTask={handleAddTask}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
          onEditTask={handleEditTask}
        />
      )}

      {activeTab === 'reports' && (
        <ReportView
          user={user}
          calls={calls}
          guests={guests}
          enrollments={enrollments}
          inquiries={inquiries}
          tasks={tasks}
          notes={dailyNotes}
          onUpdateNotes={setDailyNotes}
        />
      )}

      {activeTab === 'profile' && (
        <UserProfileComponent
          user={user}
          onUpdate={setUser}
          onLogout={handleLogout}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
        />
      )}
    </Layout>
  );
}
