/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PhoneCall, UserCheck, Award, HelpCircle, FileText, Plus, Trash2, CheckCircle, AlertCircle, Sparkles, Pencil } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CallLog, GuestLog, EnrollmentLog, InquiryLog, DailyNotes } from '../types';

interface ActivityLoggerProps {
  calls: CallLog[];
  guests: GuestLog[];
  enrollments: EnrollmentLog[];
  inquiries: InquiryLog[];
  dailyNotes: DailyNotes;
  onAddCall: (call: Omit<CallLog, 'id' | 'timestamp'> & { timestamp?: string }) => void;
  onAddGuest: (guest: Omit<GuestLog, 'id' | 'timestamp'> & { timestamp?: string }) => void;
  onAddEnrollment: (enrollment: Omit<EnrollmentLog, 'id' | 'timestamp'> & { timestamp?: string }) => void;
  onAddInquiry: (inquiry: Omit<InquiryLog, 'id' | 'timestamp'> & { timestamp?: string }) => void;
  onUpdateDailyNotes: (notes: DailyNotes) => void;
  onDeleteLog: (category: 'calls' | 'guests' | 'enrollments' | 'inquiries', id: string) => void;
  onEditCall?: (id: string, updatedFields: Partial<CallLog>) => void;
  onEditInquiry?: (id: string, updatedFields: Partial<InquiryLog>) => void;
  onEditEnrollment?: (id: string, updatedFields: Partial<EnrollmentLog>) => void;
  onEditGuest?: (id: string, updatedFields: Partial<GuestLog>) => void;
  initialActiveSubTab?: 'call' | 'guest' | 'enrollment' | 'inquiry' | 'notes';
}

type SubTab = 'call' | 'guest' | 'enrollment' | 'inquiry' | 'notes';

export default function ActivityLogger({
  calls,
  guests,
  enrollments,
  inquiries,
  dailyNotes,
  onAddCall,
  onAddGuest,
  onAddEnrollment,
  onAddInquiry,
  onUpdateDailyNotes,
  onDeleteLog,
  onEditCall,
  onEditInquiry,
  onEditEnrollment,
  onEditGuest,
  initialActiveSubTab = 'call',
}: ActivityLoggerProps) {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>(initialActiveSubTab);

  const getLocalDateTimeString = () => {
    const tzoffset = (new Date()).getTimezoneOffset() * 60000;
    const localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 16);
    return localISOTime;
  };

  const [useCustomTime, setUseCustomTime] = useState(false);
  const [customTime, setCustomTime] = useState(getLocalDateTimeString());

  // Call Editing State
  const [editingCallId, setEditingCallId] = useState<string | null>(null);
  const [editCallType, setEditCallType] = useState<'incoming' | 'outgoing'>('outgoing');
  const [editCallPhoneNumber, setEditCallPhoneNumber] = useState('');
  const [editCallContactName, setEditCallContactName] = useState('');
  const [editCallNotes, setEditCallNotes] = useState('');
  const [editCallIsImportant, setEditCallIsImportant] = useState(false);
  const [editCallTimestamp, setEditCallTimestamp] = useState('');

  const startEditingCall = (call: CallLog) => {
    setEditingCallId(call.id);
    setEditCallType(call.type);
    setEditCallPhoneNumber(call.phoneNumber);
    setEditCallContactName(call.contactName || '');
    setEditCallNotes(call.notes || '');
    setEditCallIsImportant(call.isImportant);
    
    // Format call timestamp to YYYY-MM-DDTHH:mm
    try {
      const d = new Date(call.timestamp);
      const tzoffset = d.getTimezoneOffset() * 60000;
      const localISOTime = (new Date(d.getTime() - tzoffset)).toISOString().slice(0, 16);
      setEditCallTimestamp(localISOTime);
    } catch (e) {
      setEditCallTimestamp(getLocalDateTimeString());
    }
  };

  const saveEditCall = (id: string) => {
    if (!onEditCall) return;
    onEditCall(id, {
      type: editCallType,
      phoneNumber: editCallPhoneNumber.trim(),
      contactName: editCallContactName.trim() || undefined,
      notes: editCallNotes.trim(),
      isImportant: editCallIsImportant,
      timestamp: new Date(editCallTimestamp).toISOString(),
    });
    setEditingCallId(null);
  };

  // Inquiry Editing State
  const [editingInquiryId, setEditingInquiryId] = useState<string | null>(null);
  const [editInquiryName, setEditInquiryName] = useState('');
  const [editInquiryType, setEditInquiryType] = useState('Pricing & Fees');
  const [editInquiryDetails, setEditInquiryDetails] = useState('');
  const [editInquiryStatus, setEditInquiryStatus] = useState<'Resolved' | 'Pending'>('Resolved');
  const [editInquiryTimestamp, setEditInquiryTimestamp] = useState('');

  const startEditingInquiry = (inquiry: InquiryLog) => {
    setEditingInquiryId(inquiry.id);
    setEditInquiryName(inquiry.inquirerName || '');
    setEditInquiryType(inquiry.type);
    setEditInquiryDetails(inquiry.details);
    setEditInquiryStatus(inquiry.status);
    
    try {
      const d = new Date(inquiry.timestamp);
      const tzoffset = d.getTimezoneOffset() * 60000;
      const localISOTime = (new Date(d.getTime() - tzoffset)).toISOString().slice(0, 16);
      setEditInquiryTimestamp(localISOTime);
    } catch (e) {
      setEditInquiryTimestamp(getLocalDateTimeString());
    }
  };

  const saveEditInquiry = (id: string) => {
    if (!onEditInquiry) return;
    onEditInquiry(id, {
      inquirerName: editInquiryName.trim() || undefined,
      type: editInquiryType.trim(),
      details: editInquiryDetails.trim(),
      status: editInquiryStatus,
      timestamp: new Date(editInquiryTimestamp).toISOString(),
    });
    setEditingInquiryId(null);
  };

  // Inquiry custom timestamp state
  const [useInquiryCustomTime, setUseInquiryCustomTime] = useState(false);
  const [inquiryCustomTime, setInquiryCustomTime] = useState(getLocalDateTimeString());

  // Enrollment Editing State
  const [editingEnrollmentId, setEditingEnrollmentId] = useState<string | null>(null);
  const [editStudentName, setEditStudentName] = useState('');
  const [editEnrollmentProgram, setEditEnrollmentProgram] = useState('AI');
  const [editEnrollmentStatus, setEditEnrollmentStatus] = useState<'Completed' | 'Pending'>('Completed');
  const [editEnrollmentTimestamp, setEditEnrollmentTimestamp] = useState('');

  const startEditingEnrollment = (enrollment: EnrollmentLog) => {
    setEditingEnrollmentId(enrollment.id);
    setEditStudentName(enrollment.studentName || '');
    setEditEnrollmentProgram(enrollment.program);
    setEditEnrollmentStatus(enrollment.status);
    
    try {
      const d = new Date(enrollment.timestamp);
      const tzoffset = d.getTimezoneOffset() * 60000;
      const localISOTime = (new Date(d.getTime() - tzoffset)).toISOString().slice(0, 16);
      setEditEnrollmentTimestamp(localISOTime);
    } catch (e) {
      setEditEnrollmentTimestamp(getLocalDateTimeString());
    }
  };

  const saveEditEnrollment = (id: string) => {
    if (!onEditEnrollment) return;
    onEditEnrollment(id, {
      studentName: editStudentName.trim(),
      program: editEnrollmentProgram.trim(),
      status: editEnrollmentStatus,
      timestamp: new Date(editEnrollmentTimestamp).toISOString(),
    });
    setEditingEnrollmentId(null);
  };

  // Enrollment custom timestamp state
  const [useEnrollmentCustomTime, setUseEnrollmentCustomTime] = useState(false);
  const [enrollmentCustomTime, setEnrollmentCustomTime] = useState(getLocalDateTimeString());

  // Guest Editing State
  const [editingGuestId, setEditingGuestId] = useState<string | null>(null);
  const [editGuestName, setEditGuestName] = useState('');
  const [editPurposeOfVisit, setEditPurposeOfVisit] = useState('Enrollment Inquiry');
  const [editGuestCount, setEditGuestCount] = useState(1);
  const [editGuestTimestamp, setEditGuestTimestamp] = useState('');

  const startEditingGuest = (guest: GuestLog) => {
    setEditingGuestId(guest.id);
    setEditGuestName(guest.guestName || '');
    setEditPurposeOfVisit(guest.purpose);
    setEditGuestCount(guest.count);
    
    try {
      const d = new Date(guest.timestamp);
      const tzoffset = d.getTimezoneOffset() * 60000;
      const localISOTime = (new Date(d.getTime() - tzoffset)).toISOString().slice(0, 16);
      setEditGuestTimestamp(localISOTime);
    } catch (e) {
      setEditGuestTimestamp(getLocalDateTimeString());
    }
  };

  const saveEditGuest = (id: string) => {
    if (!onEditGuest) return;
    onEditGuest(id, {
      guestName: editGuestName.trim(),
      purpose: editPurposeOfVisit.trim(),
      count: editGuestCount,
      timestamp: new Date(editGuestTimestamp).toISOString(),
    });
    setEditingGuestId(null);
  };

  // Guest custom timestamp state
  const [useGuestCustomTime, setUseGuestCustomTime] = useState(false);
  const [guestCustomTime, setGuestCustomTime] = useState(getLocalDateTimeString());

  // Forms state
  // 1. Call state
  const [callType, setCallType] = useState<'incoming' | 'outgoing'>('outgoing');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [contactName, setContactName] = useState('');
  const [callNotes, setCallNotes] = useState('');
  const [isImportant, setIsImportant] = useState(false);

  // 2. Guest state
  const [guestName, setGuestName] = useState('');
  const [purposeOfVisit, setPurposeOfVisit] = useState('Enrollment Inquiry');
  const [guestCount, setGuestCount] = useState(1);

  // 3. Enrollment state
  const [studentName, setStudentName] = useState('');
  const [program, setProgram] = useState('AI');
  const [enrollmentStatus, setEnrollmentStatus] = useState<'Completed' | 'Pending'>('Completed');

  // 4. Inquiry state
  const [inquirerName, setInquirerName] = useState('');
  const [inquiryType, setInquiryType] = useState('Pricing & Fees');
  const [inquiryDetails, setInquiryDetails] = useState('');
  const [inquiryStatus, setInquiryStatus] = useState<'Resolved' | 'Pending'>('Resolved');

  // 5. Daily Notes State
  const [challenges, setChallenges] = useState(dailyNotes.challenges);
  const [achievements, setAchievements] = useState(dailyNotes.achievements);
  const [observations, setObservations] = useState(dailyNotes.observations);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Submit handlers
  const handleCallSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;
    onAddCall({
      type: callType,
      phoneNumber,
      contactName: contactName || undefined,
      notes: callNotes,
      isImportant,
      timestamp: useCustomTime ? new Date(customTime).toISOString() : undefined,
    });
    // Reset
    setPhoneNumber('');
    setContactName('');
    setCallNotes('');
    setIsImportant(false);
    setUseCustomTime(false);
    setCustomTime(getLocalDateTimeString());
  };

  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!purposeOfVisit) return;
    onAddGuest({
      guestName: guestName || undefined,
      purpose: purposeOfVisit,
      count: guestCount,
      timestamp: useGuestCustomTime ? new Date(guestCustomTime).toISOString() : undefined,
    });
    setGuestName('');
    setPurposeOfVisit('Enrollment Inquiry');
    setGuestCount(1);
    setUseGuestCustomTime(false);
    setGuestCustomTime(getLocalDateTimeString());
  };

  const handleEnrollmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName) return;
    onAddEnrollment({
      studentName,
      program,
      status: enrollmentStatus,
      timestamp: useEnrollmentCustomTime ? new Date(enrollmentCustomTime).toISOString() : undefined,
    });
    setStudentName('');
    setProgram('AI');
    setEnrollmentStatus('Completed');
    setUseEnrollmentCustomTime(false);
    setEnrollmentCustomTime(getLocalDateTimeString());
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryDetails) return;
    onAddInquiry({
      inquirerName: inquirerName || undefined,
      type: inquiryType,
      details: inquiryDetails,
      status: inquiryStatus,
      timestamp: useInquiryCustomTime ? new Date(inquiryCustomTime).toISOString() : undefined,
    });
    setInquirerName('');
    setInquiryType('Pricing & Fees');
    setInquiryDetails('');
    setInquiryStatus('Resolved');
    setUseInquiryCustomTime(false);
    setInquiryCustomTime(getLocalDateTimeString());
  };

  const handleSaveNotes = () => {
    onUpdateDailyNotes({
      challenges,
      achievements,
      observations,
      aiSummary: dailyNotes.aiSummary,
    });
  };

  // Call the server endpoint for Gemini-powered automatic Daily Notes generation / recommendations
  const handleAIAssist = async () => {
    setIsGeneratingAI(true);
    try {
      const summaryPayload = {
        callsCount: calls.length,
        guestsCount: guests.reduce((acc, c) => acc + c.count, 0),
        enrollmentsCount: enrollments.length,
        inquiriesCount: inquiries.length,
        rawNotes: { challenges, achievements, observations },
      };

      const response = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: summaryPayload }),
      });
      const data = await response.json();
      if (data.aiSummary) {
        onUpdateDailyNotes({
          challenges,
          achievements,
          observations,
          aiSummary: data.aiSummary,
        });
      }
    } catch (err) {
      console.error("AI Generation failed:", err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const tabItem = (tab: SubTab, label: string, icon: React.ComponentType<any>) => {
    const Icon = icon;
    const isActive = activeSubTab === tab;
    return (
      <button
        onClick={() => setActiveSubTab(tab)}
        className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold cursor-pointer transition whitespace-nowrap ${
          isActive
            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/15'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
        }`}
      >
        <Icon className="w-4 h-4" />
        {label}
      </button>
    );
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Tab Select Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          Activity Logging
        </h3>
      </div>

      {/* Horizontal scrolling sub-tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {tabItem('call', 'Calls Log', PhoneCall)}
        {tabItem('guest', 'Guests Log', UserCheck)}
        {tabItem('enrollment', 'Enrollments', Award)}
        {tabItem('inquiry', 'Client Inquiries', HelpCircle)}
        {tabItem('notes', 'Daily Notes', FileText)}
      </div>

      {/* Forms and Active Logs list */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Logging Form */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <AnimatePresence mode="wait">
            {activeSubTab === 'call' && (
              <motion.form
                key="call-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleCallSubmit}
                className="space-y-4"
              >
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-blue-600" /> Log Call Activity
                </h4>

                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setCallType('outgoing')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold cursor-pointer transition ${
                      callType === 'outgoing'
                        ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Outgoing Call
                  </button>
                  <button
                    type="button"
                    onClick={() => setCallType('incoming')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold cursor-pointer transition ${
                      callType === 'incoming'
                        ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Incoming Call
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. +1 (555) 019-2834"
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-0 focus:ring-2 focus:ring-blue-500 rounded-xl py-3 px-4 text-slate-800 dark:text-slate-100 text-xs font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                    Contact Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Jane Doe"
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-0 focus:ring-2 focus:ring-blue-500 rounded-xl py-3 px-4 text-slate-800 dark:text-slate-100 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                    Call Conversation Notes
                  </label>
                  <textarea
                    value={callNotes}
                    onChange={(e) => setCallNotes(e.target.value)}
                    placeholder="Describe inquiry, next steps, or follow up plan..."
                    rows={3}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-0 focus:ring-2 focus:ring-blue-500 rounded-xl py-3 px-4 text-slate-800 dark:text-slate-100 text-xs resize-none"
                  />
                </div>

                {/* Manual timestamp section */}
                <div className="space-y-2 py-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="useCustomTime"
                      checked={useCustomTime}
                      onChange={(e) => setUseCustomTime(e.target.checked)}
                      className="rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="useCustomTime" className="text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer">
                      Manually set date & time of call
                    </label>
                  </div>
                  {useCustomTime && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="overflow-hidden"
                    >
                      <input
                        type="datetime-local"
                        value={customTime}
                        onChange={(e) => setCustomTime(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border-0 focus:ring-2 focus:ring-blue-500 rounded-xl py-2.5 px-4 text-slate-800 dark:text-slate-100 text-xs font-mono"
                        required
                      />
                    </motion.div>
                  )}
                </div>

                <div className="flex items-center gap-2 py-1">
                  <input
                    type="checkbox"
                    id="important"
                    checked={isImportant}
                    onChange={(e) => setIsImportant(e.target.checked)}
                    className="rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="important" className="text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer">
                    Mark as Important (Flags on report)
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-semibold text-xs transition shadow-md shadow-blue-500/15 cursor-pointer"
                >
                  Log Call Activity
                </button>
              </motion.form>
            )}

            {activeSubTab === 'guest' && (
              <motion.form
                key="guest-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleGuestSubmit}
                className="space-y-4"
              >
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-sky-600" /> Log Guest Reception
                </h4>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                    Guest Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="e.g. Dr. Thomas Lee"
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-0 focus:ring-2 focus:ring-blue-500 rounded-xl py-3 px-4 text-slate-800 dark:text-slate-100 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                    Purpose of Visit
                  </label>
                  <input
                    type="text"
                    list="guest-purposes"
                    value={purposeOfVisit}
                    onChange={(e) => setPurposeOfVisit(e.target.value)}
                    placeholder="e.g. Enrollment Inquiry"
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-0 focus:ring-2 focus:ring-blue-500 rounded-xl py-3 px-4 text-slate-800 dark:text-slate-100 text-xs"
                    required
                  />
                  <datalist id="guest-purposes">
                    <option value="Enrollment Inquiry" />
                    <option value="Admissions Appointment" />
                    <option value="Campus Tour" />
                    <option value="Document Submission" />
                    <option value="Academic Advising" />
                    <option value="Other / General Visit" />
                  </datalist>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                    Number of Guests Received
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                      className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-200"
                    >
                      -
                    </button>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{guestCount}</span>
                    <button
                      type="button"
                      onClick={() => setGuestCount(guestCount + 1)}
                      className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-200"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Manual timestamp section for guests */}
                <div className="space-y-2 py-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="useGuestCustomTime"
                      checked={useGuestCustomTime}
                      onChange={(e) => setUseGuestCustomTime(e.target.checked)}
                      className="rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="useGuestCustomTime" className="text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer">
                      Manually set date & time of reception
                    </label>
                  </div>
                  {useGuestCustomTime && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="overflow-hidden"
                    >
                      <input
                        type="datetime-local"
                        value={guestCustomTime}
                        onChange={(e) => setGuestCustomTime(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border-0 focus:ring-2 focus:ring-blue-500 rounded-xl py-2.5 px-4 text-slate-800 dark:text-slate-100 text-xs font-mono"
                        required
                      />
                    </motion.div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-semibold text-xs transition shadow-md shadow-blue-500/15 cursor-pointer"
                >
                  Log Guest Reception
                </button>
              </motion.form>
            )}

            {activeSubTab === 'enrollment' && (
              <motion.form
                key="enrollment-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleEnrollmentSubmit}
                className="space-y-4"
              >
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-600" /> Log Enrollment Status
                </h4>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                    Student Name
                  </label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="e.g. Alice Cooper"
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-0 focus:ring-2 focus:ring-blue-500 rounded-xl py-3 px-4 text-slate-800 dark:text-slate-100 text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                    Enrollment Program / Department
                  </label>
                  <select
                    value={program}
                    onChange={(e) => setProgram(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-0 focus:ring-2 focus:ring-blue-500 rounded-xl py-3 px-4 text-slate-800 dark:text-slate-100 text-xs"
                  >
                    <option>AI</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                    Enrollment Status
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setEnrollmentStatus('Completed')}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold cursor-pointer border transition ${
                        enrollmentStatus === 'Completed'
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400'
                          : 'bg-slate-50 border-slate-100 dark:bg-slate-800 dark:border-slate-700 text-slate-500'
                      }`}
                    >
                      Completed (Fee Paid)
                    </button>
                    <button
                      type="button"
                      onClick={() => setEnrollmentStatus('Pending')}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold cursor-pointer border transition ${
                        enrollmentStatus === 'Pending'
                          ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400'
                          : 'bg-slate-50 border-slate-100 dark:bg-slate-800 dark:border-slate-700 text-slate-500'
                      }`}
                    >
                      Pending Documents
                    </button>
                  </div>
                </div>

                {/* Manual timestamp section for enrollments */}
                <div className="space-y-2 py-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="useEnrollmentCustomTime"
                      checked={useEnrollmentCustomTime}
                      onChange={(e) => setUseEnrollmentCustomTime(e.target.checked)}
                      className="rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="useEnrollmentCustomTime" className="text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer">
                      Manually set date & time of enrollment
                    </label>
                  </div>
                  {useEnrollmentCustomTime && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="overflow-hidden"
                    >
                      <input
                        type="datetime-local"
                        value={enrollmentCustomTime}
                        onChange={(e) => setEnrollmentCustomTime(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border-0 focus:ring-2 focus:ring-blue-500 rounded-xl py-2.5 px-4 text-slate-800 dark:text-slate-100 text-xs font-mono"
                        required
                      />
                    </motion.div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-semibold text-xs transition shadow-md shadow-blue-500/15 cursor-pointer"
                >
                  Log Enrollment Tracking
                </button>
              </motion.form>
            )}

            {activeSubTab === 'inquiry' && (
              <motion.form
                key="inquiry-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleInquirySubmit}
                className="space-y-4"
              >
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-purple-600" /> Log Client Inquiry
                </h4>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                    Client Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={inquirerName}
                    onChange={(e) => setInquirerName(e.target.value)}
                    placeholder="e.g. Marcus Aurelius"
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-0 focus:ring-2 focus:ring-blue-500 rounded-xl py-3 px-4 text-slate-800 dark:text-slate-100 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                    Type of Inquiry (Type anything or select)
                  </label>
                  <input
                    type="text"
                    list="inquiry-types"
                    value={inquiryType}
                    onChange={(e) => setInquiryType(e.target.value)}
                    placeholder="e.g. Pricing & Fees or custom inquiry type"
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-0 focus:ring-2 focus:ring-blue-500 rounded-xl py-3 px-4 text-slate-800 dark:text-slate-100 text-xs"
                    required
                  />
                  <datalist id="inquiry-types">
                    <option value="Pricing & Fees" />
                    <option value="Admission Requirements" />
                    <option value="Class Schedules" />
                    <option value="Scholarships & Grants" />
                    <option value="Technical Support" />
                    <option value="Other / Academic" />
                  </datalist>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                    Inquiry Details / Client Question
                  </label>
                  <textarea
                    value={inquiryDetails}
                    onChange={(e) => setInquiryDetails(e.target.value)}
                    placeholder="Describe their exact inquiry or problem..."
                    rows={3}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-0 focus:ring-2 focus:ring-blue-500 rounded-xl py-3 px-4 text-slate-800 dark:text-slate-100 text-xs resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                    Resolution Status
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setInquiryStatus('Resolved')}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold cursor-pointer border transition ${
                        inquiryStatus === 'Resolved'
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400'
                          : 'bg-slate-50 border-slate-100 dark:bg-slate-800 dark:border-slate-700 text-slate-500'
                      }`}
                    >
                      Resolved (Answered)
                    </button>
                    <button
                      type="button"
                      onClick={() => setInquiryStatus('Pending')}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold cursor-pointer border transition ${
                        inquiryStatus === 'Pending'
                          ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400'
                          : 'bg-slate-50 border-slate-100 dark:bg-slate-800 dark:border-slate-700 text-slate-500'
                      }`}
                    >
                      Pending Follow-Up
                    </button>
                  </div>
                </div>

                {/* Manual timestamp section for inquiries */}
                <div className="space-y-2 py-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="useInquiryCustomTime"
                      checked={useInquiryCustomTime}
                      onChange={(e) => setUseInquiryCustomTime(e.target.checked)}
                      className="rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="useInquiryCustomTime" className="text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer">
                      Manually set date & time of inquiry
                    </label>
                  </div>
                  {useInquiryCustomTime && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="overflow-hidden"
                    >
                      <input
                        type="datetime-local"
                        value={inquiryCustomTime}
                        onChange={(e) => setInquiryCustomTime(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border-0 focus:ring-2 focus:ring-blue-500 rounded-xl py-2.5 px-4 text-slate-800 dark:text-slate-100 text-xs font-mono"
                        required
                      />
                    </motion.div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-semibold text-xs transition shadow-md shadow-blue-500/15 cursor-pointer"
                >
                  Log Client Inquiry
                </button>
              </motion.form>
            )}

            {activeSubTab === 'notes' && (
              <motion.div
                key="notes-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600" /> Daily Notes & Notes Summary
                  </h4>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAIAssist}
                    disabled={isGeneratingAI}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-[10px] font-bold cursor-pointer transition shadow-sm shadow-violet-500/15 disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {isGeneratingAI ? 'AI Writing...' : 'AI Report Refiner'}
                  </motion.button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                    Challenges Faced Today
                  </label>
                  <textarea
                    value={challenges}
                    onChange={(e) => setChallenges(e.target.value)}
                    placeholder="e.g. Slower portal loading speeds during high-traffic midday enrollments."
                    rows={2}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-0 focus:ring-2 focus:ring-blue-500 rounded-xl py-3 px-4 text-slate-800 dark:text-slate-100 text-xs resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                    Key Achievements Today
                  </label>
                  <textarea
                    value={achievements}
                    onChange={(e) => setAchievements(e.target.value)}
                    placeholder="e.g. Successfully registered all pending continuing studies candidates."
                    rows={2}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-0 focus:ring-2 focus:ring-blue-500 rounded-xl py-3 px-4 text-slate-800 dark:text-slate-100 text-xs resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                    Important Observations
                  </label>
                  <textarea
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    placeholder="e.g. Increase in client inquiries regarding pricing for MBA weekend tracks."
                    rows={2}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-0 focus:ring-2 focus:ring-blue-500 rounded-xl py-3 px-4 text-slate-800 dark:text-slate-100 text-xs resize-none"
                  />
                </div>

                {dailyNotes.aiSummary && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-500/10 to-indigo-500/10 border border-violet-100 dark:border-violet-950/50">
                    <div className="flex items-center gap-1.5 text-violet-700 dark:text-violet-400 text-xs font-bold mb-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      AI Refined Summary
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans italic">
                      "{dailyNotes.aiSummary}"
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleSaveNotes}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-semibold text-xs transition shadow-md shadow-blue-500/15 cursor-pointer"
                >
                  Save Notes Changes
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right column: List of today's active logs */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between max-h-[580px]">
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center justify-between">
              <span>Today's Active Logs ({
                activeSubTab === 'call' ? calls.length :
                activeSubTab === 'guest' ? guests.length :
                activeSubTab === 'enrollment' ? enrollments.length :
                activeSubTab === 'inquiry' ? inquiries.length : 0
              })</span>
              <span className="text-xs text-slate-400 font-medium">Click trash to delete</span>
            </h4>

            <div className="space-y-3 overflow-y-auto max-h-[440px] pr-1">
              {activeSubTab === 'call' && (
                calls.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-400 dark:text-slate-500">No calls logged yet today.</div>
                ) : (
                  calls.map((call) => (
                    editingCallId === call.id ? (
                      <div key={call.id} className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-blue-200 dark:border-blue-900/40 rounded-2xl space-y-3 shadow-inner text-xs">
                        <div className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                          Edit Call Log
                        </div>
                        <div className="space-y-2.5">
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => setEditCallType('outgoing')}
                              className={`py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition text-center ${
                                editCallType === 'outgoing'
                                  ? 'bg-blue-600 text-white shadow-sm'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                              }`}
                            >
                              Outgoing
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditCallType('incoming')}
                              className={`py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition text-center ${
                                editCallType === 'incoming'
                                  ? 'bg-amber-600 text-white shadow-sm'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                              }`}
                            >
                              Incoming
                            </button>
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Phone Number</label>
                            <input
                              type="text"
                              value={editCallPhoneNumber}
                              onChange={(e) => setEditCallPhoneNumber(e.target.value)}
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg py-1.5 px-2.5 text-xs text-slate-800 dark:text-slate-100 font-mono"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Contact Name</label>
                            <input
                              type="text"
                              value={editCallContactName}
                              onChange={(e) => setEditCallContactName(e.target.value)}
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg py-1.5 px-2.5 text-xs text-slate-800 dark:text-slate-100"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Conversation Notes</label>
                            <textarea
                              value={editCallNotes}
                              onChange={(e) => setEditCallNotes(e.target.value)}
                              rows={2}
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg py-1.5 px-2.5 text-xs text-slate-800 dark:text-slate-100 resize-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Date & Time</label>
                            <input
                              type="datetime-local"
                              value={editCallTimestamp}
                              onChange={(e) => setEditCallTimestamp(e.target.value)}
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg py-1.5 px-2.5 text-xs text-slate-800 dark:text-slate-100 font-mono"
                              required
                            />
                          </div>
                          <div className="flex items-center gap-1.5 py-0.5">
                            <input
                              type="checkbox"
                              id={`edit-important-${call.id}`}
                              checked={editCallIsImportant}
                              onChange={(e) => setEditCallIsImportant(e.target.checked)}
                              className="rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                            />
                            <label htmlFor={`edit-important-${call.id}`} className="text-[10px] font-bold text-slate-500 dark:text-slate-400 cursor-pointer select-none">
                              Mark as Important
                            </label>
                          </div>
                        </div>
                        <div className="flex gap-2 justify-end pt-1">
                          <button
                            type="button"
                            onClick={() => setEditingCallId(null)}
                            className="px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-500 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => saveEditCall(call.id)}
                            className="px-2.5 py-1 rounded-lg text-[10px] font-bold text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div key={call.id} className="flex gap-3 text-xs items-start bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className={`font-bold ${call.type === 'outgoing' ? 'text-blue-600 dark:text-blue-400' : 'text-amber-600 dark:text-amber-400'}`}>
                              {call.type === 'outgoing' ? 'Outgoing' : 'Incoming'}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => startEditingCall(call)}
                                className="text-slate-400 hover:text-blue-500 cursor-pointer transition p-0.5"
                                title="Edit Call Log"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => onDeleteLog('calls', call.id)}
                                className="text-slate-400 hover:text-red-500 cursor-pointer transition p-0.5"
                                title="Delete Call Log"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                            {new Date(call.timestamp).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                          </span>
                          <p className="text-slate-700 dark:text-slate-300 font-mono mt-1 text-xs">{call.phoneNumber}</p>
                          {call.contactName && <p className="text-slate-500 mt-0.5">Contact: {call.contactName}</p>}
                          {call.notes && <p className="text-slate-400 dark:text-slate-500 italic mt-1 font-sans">"{call.notes}"</p>}
                          {call.isImportant && <span className="inline-block bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400 text-[9px] font-bold px-1.5 py-0.5 rounded-md mt-1.5">★ Important</span>}
                        </div>
                      </div>
                    )
                  ))
                )
              )}

              {activeSubTab === 'guest' && (
                guests.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-400 dark:text-slate-500">No guests logged yet today.</div>
                ) : (
                  guests.map((guest) => (
                    editingGuestId === guest.id ? (
                      <div key={guest.id} className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-blue-200 dark:border-blue-900/40 rounded-2xl space-y-3 shadow-inner text-xs">
                        <div className="text-[10px] font-extrabold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                          Edit Guest Reception Log
                        </div>
                        <div className="space-y-2.5">
                          <div>
                            <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Guest Name</label>
                            <input
                              type="text"
                              value={editGuestName}
                              onChange={(e) => setEditGuestName(e.target.value)}
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg py-1.5 px-2.5 text-xs text-slate-800 dark:text-slate-100"
                              placeholder="e.g. Dr. Thomas Lee"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Purpose of Visit</label>
                            <input
                              type="text"
                              list="edit-guest-purposes"
                              value={editPurposeOfVisit}
                              onChange={(e) => setEditPurposeOfVisit(e.target.value)}
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg py-1.5 px-2.5 text-xs text-slate-800 dark:text-slate-100"
                              required
                            />
                            <datalist id="edit-guest-purposes">
                              <option value="Enrollment Inquiry" />
                              <option value="Admissions Appointment" />
                              <option value="Campus Tour" />
                              <option value="Document Submission" />
                              <option value="Academic Advising" />
                              <option value="Other / General Visit" />
                            </datalist>
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Date & Time</label>
                            <input
                              type="datetime-local"
                              value={editGuestTimestamp}
                              onChange={(e) => setEditGuestTimestamp(e.target.value)}
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg py-1.5 px-2.5 text-xs text-slate-800 dark:text-slate-100 font-mono"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Number of Guests</label>
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => setEditGuestCount(Math.max(1, editGuestCount - 1))}
                                className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-200 cursor-pointer"
                              >
                                -
                              </button>
                              <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{editGuestCount}</span>
                              <button
                                type="button"
                                onClick={() => setEditGuestCount(editGuestCount + 1)}
                                className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-200 cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 justify-end pt-1">
                          <button
                            type="button"
                            onClick={() => setEditingGuestId(null)}
                            className="px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-500 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => saveEditGuest(guest.id)}
                            className="px-2.5 py-1 rounded-lg text-[10px] font-bold text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div key={guest.id} className="flex gap-3 text-xs items-start bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-700 dark:text-slate-300">
                              {guest.guestName || 'Unnamed Guest'} ({guest.count} {guest.count === 1 ? 'person' : 'people'})
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => startEditingGuest(guest)}
                                className="text-slate-400 hover:text-blue-500 cursor-pointer transition p-0.5"
                                title="Edit Guest Log"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => onDeleteLog('guests', guest.id)}
                                className="text-slate-400 hover:text-red-500 cursor-pointer transition p-0.5"
                                title="Delete Guest Log"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                            {new Date(guest.timestamp).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                          </span>
                          <p className="text-slate-500 dark:text-slate-400 mt-1">Purpose: <span className="font-semibold text-slate-600 dark:text-slate-300">{guest.purpose}</span></p>
                        </div>
                      </div>
                    )
                  ))
                )
              )}

              {activeSubTab === 'enrollment' && (
                enrollments.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-400 dark:text-slate-500">No enrollments logged yet today.</div>
                ) : (
                  enrollments.map((enr) => (
                    editingEnrollmentId === enr.id ? (
                      <div key={enr.id} className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-blue-200 dark:border-blue-900/40 rounded-2xl space-y-3 shadow-inner text-xs">
                        <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                          Edit Enrollment Log
                        </div>
                        <div className="space-y-2.5">
                          <div>
                            <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Student Name</label>
                            <input
                              type="text"
                              value={editStudentName}
                              onChange={(e) => setEditStudentName(e.target.value)}
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg py-1.5 px-2.5 text-xs text-slate-800 dark:text-slate-100"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Enrollment Program / Department</label>
                            <input
                              type="text"
                              list="edit-enrollment-programs"
                              value={editEnrollmentProgram}
                              onChange={(e) => setEditEnrollmentProgram(e.target.value)}
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg py-1.5 px-2.5 text-xs text-slate-800 dark:text-slate-100"
                              required
                            />
                            <datalist id="edit-enrollment-programs">
                              <option value="AI" />
                              <option value="Bachelor of Science in Computer Science" />
                              <option value="Master of Business Administration (MBA)" />
                            </datalist>
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Date & Time</label>
                            <input
                              type="datetime-local"
                              value={editEnrollmentTimestamp}
                              onChange={(e) => setEditEnrollmentTimestamp(e.target.value)}
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg py-1.5 px-2.5 text-xs text-slate-800 dark:text-slate-100 font-mono"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Status</label>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() => setEditEnrollmentStatus('Completed')}
                                className={`py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition text-center ${
                                  editEnrollmentStatus === 'Completed'
                                    ? 'bg-emerald-600 text-white shadow-sm'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                }`}
                              >
                                Completed
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditEnrollmentStatus('Pending')}
                                className={`py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition text-center ${
                                  editEnrollmentStatus === 'Pending'
                                    ? 'bg-amber-500 text-white shadow-sm'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                }`}
                              >
                                Pending
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 justify-end pt-1">
                          <button
                            type="button"
                            onClick={() => setEditingEnrollmentId(null)}
                            className="px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-500 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => saveEditEnrollment(enr.id)}
                            className="px-2.5 py-1 rounded-lg text-[10px] font-bold text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div key={enr.id} className="flex gap-3 text-xs items-start bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-700 dark:text-slate-300">
                              {enr.studentName}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => startEditingEnrollment(enr)}
                                className="text-slate-400 hover:text-blue-500 cursor-pointer transition p-0.5"
                                title="Edit Enrollment Log"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => onDeleteLog('enrollments', enr.id)}
                                className="text-slate-400 hover:text-red-500 cursor-pointer transition p-0.5"
                                title="Delete Enrollment Log"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                            {new Date(enr.timestamp).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                          </span>
                          <p className="text-slate-500 dark:text-slate-400 mt-1">Program: {enr.program}</p>
                          <span className={`inline-block text-[9px] font-bold rounded px-1.5 py-0.5 mt-2 ${enr.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20' : 'bg-amber-50 text-amber-600 dark:bg-amber-950/20'}`}>
                            {enr.status}
                          </span>
                        </div>
                      </div>
                    )
                  ))
                )
              )}

              {activeSubTab === 'inquiry' && (
                inquiries.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-400 dark:text-slate-500">No inquiries logged yet today.</div>
                ) : (
                  inquiries.map((inq) => (
                    editingInquiryId === inq.id ? (
                      <div key={inq.id} className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-blue-200 dark:border-blue-900/40 rounded-2xl space-y-3 shadow-inner text-xs">
                        <div className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                          Edit Client Inquiry
                        </div>
                        <div className="space-y-2.5">
                          <div>
                            <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Client Name</label>
                            <input
                              type="text"
                              value={editInquiryName}
                              onChange={(e) => setEditInquiryName(e.target.value)}
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg py-1.5 px-2.5 text-xs text-slate-800 dark:text-slate-100"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Type of Inquiry</label>
                            <input
                              type="text"
                              list="edit-inquiry-types"
                              value={editInquiryType}
                              onChange={(e) => setEditInquiryType(e.target.value)}
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg py-1.5 px-2.5 text-xs text-slate-800 dark:text-slate-100"
                              required
                            />
                            <datalist id="edit-inquiry-types">
                              <option value="Pricing & Fees" />
                              <option value="Admission Requirements" />
                              <option value="Class Schedules" />
                              <option value="Scholarships & Grants" />
                              <option value="Technical Support" />
                              <option value="Other / Academic" />
                            </datalist>
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Inquiry Details</label>
                            <textarea
                              value={editInquiryDetails}
                              onChange={(e) => setEditInquiryDetails(e.target.value)}
                              rows={2}
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg py-1.5 px-2.5 text-xs text-slate-800 dark:text-slate-100 resize-none"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Date & Time</label>
                            <input
                              type="datetime-local"
                              value={editInquiryTimestamp}
                              onChange={(e) => setEditInquiryTimestamp(e.target.value)}
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg py-1.5 px-2.5 text-xs text-slate-800 dark:text-slate-100 font-mono"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Status</label>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() => setEditInquiryStatus('Resolved')}
                                className={`py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition text-center ${
                                  editInquiryStatus === 'Resolved'
                                    ? 'bg-emerald-600 text-white shadow-sm'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                }`}
                              >
                                Resolved
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditInquiryStatus('Pending')}
                                className={`py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition text-center ${
                                  editInquiryStatus === 'Pending'
                                    ? 'bg-amber-500 text-white shadow-sm'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                }`}
                              >
                                Pending
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 justify-end pt-1">
                          <button
                            type="button"
                            onClick={() => setEditingInquiryId(null)}
                            className="px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-500 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => saveEditInquiry(inq.id)}
                            className="px-2.5 py-1 rounded-lg text-[10px] font-bold text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div key={inq.id} className="flex gap-3 text-xs items-start bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-700 dark:text-slate-300">
                              {inq.inquirerName || 'Anonymous'} ({inq.type})
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => startEditingInquiry(inq)}
                                className="text-slate-400 hover:text-blue-500 cursor-pointer transition p-0.5"
                                title="Edit Inquiry Log"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => onDeleteLog('inquiries', inq.id)}
                                className="text-slate-400 hover:text-red-500 cursor-pointer transition p-0.5"
                                title="Delete Inquiry Log"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                            {new Date(inq.timestamp).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                          </span>
                          <p className="text-slate-500 dark:text-slate-400 mt-1">{inq.details}</p>
                          <span className={`inline-block text-[9px] font-bold rounded px-1.5 py-0.5 mt-2 ${inq.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20' : 'bg-amber-50 text-amber-600 dark:bg-amber-950/20'}`}>
                            {inq.status}
                          </span>
                        </div>
                      </div>
                    )
                  ))
                )
              )}

              {activeSubTab === 'notes' && (
                <div className="text-xs text-slate-500 dark:text-slate-400 space-y-3">
                  <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Challenges:</span>
                    <p className="italic text-slate-500">{challenges || 'None recorded'}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Achievements:</span>
                    <p className="italic text-slate-500">{achievements || 'None recorded'}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Observations:</span>
                    <p className="italic text-slate-500">{observations || 'None recorded'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
