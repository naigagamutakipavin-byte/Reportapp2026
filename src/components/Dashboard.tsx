/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PhoneCall, UserCheck, Award, FileText, CheckCircle, HelpCircle, AlertCircle, ArrowUpRight, Plus, Bell } from 'lucide-react';
import { motion } from 'motion/react';
import { CallLog, GuestLog, EnrollmentLog, InquiryLog, FollowUpTask, UserProfile } from '../types';

interface DashboardProps {
  user: UserProfile;
  calls: CallLog[];
  guests: GuestLog[];
  enrollments: EnrollmentLog[];
  inquiries: InquiryLog[];
  tasks: FollowUpTask[];
  onTabChange: (tab: 'dashboard' | 'logs' | 'tasks' | 'reports' | 'profile') => void;
  onQuickAction: (actionType: 'call' | 'guest' | 'enrollment' | 'inquiry' | 'task') => void;
}

export default function Dashboard({
  user,
  calls,
  guests,
  enrollments,
  inquiries,
  tasks,
  onTabChange,
  onQuickAction,
}: DashboardProps) {
  // Filter for today's logs (in our local-first implementation, we'll calculate based on the current system date)
  const todayStr = new Date().toISOString().split('T')[0];

  const getTodayItems = <T extends { timestamp?: string; dueDate?: string }>(items: T[]) => {
    return items.filter(item => {
      const itemDate = item.timestamp ? item.timestamp.split('T')[0] : item.dueDate;
      return itemDate === todayStr;
    });
  };

  const todayCalls = getTodayItems(calls);
  const outgoingCount = todayCalls.filter(c => c.type === 'outgoing').length;
  const incomingCount = todayCalls.filter(c => c.type === 'incoming').length;

  const todayGuests = getTodayItems(guests);
  const guestCount = todayGuests.reduce((acc, curr) => acc + curr.count, 0);

  const todayEnrollments = getTodayItems(enrollments);
  const enrolledCount = todayEnrollments.filter(e => e.status === 'Completed').length;

  const todayInquiries = getTodayItems(inquiries);
  const inquiriesCount = todayInquiries.length;

  const pendingTasks = tasks.filter(t => !t.completed);
  const pendingTasksCount = pendingTasks.length;

  // Static / Mock Sparkline SVG paths for visual replication of the mockup image
  const sparklines = {
    blue: "M0 15 Q 15 5, 25 10 T 50 2 T 75 18 T 100 8",
    orange: "M0 15 Q 15 18, 25 2 T 50 15 T 75 5 T 100 12",
    sky: "M0 10 Q 15 2, 25 15 T 50 8 T 75 16 T 100 3",
    green: "M0 12 Q 15 12, 25 2 T 50 10 T 75 4 T 100 14",
    purple: "M0 18 Q 15 5, 25 15 T 50 3 T 75 12 T 100 5",
    indigo: "M0 8 Q 15 15, 25 5 T 50 18 T 75 2 T 100 10",
  };

  // Helper render for metric cards matching the mockup styling
  const renderCard = (
    title: string,
    value: number | string,
    subtext: string,
    colorClass: {
      bg: string;
      text: string;
      border: string;
      spark: string;
    },
    sparklinePath: string,
    onClick: () => void
  ) => (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative overflow-hidden cursor-pointer bg-white dark:bg-slate-900 border ${colorClass.border} rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-36`}
    >
      <div className="flex justify-between items-start">
        <div>
          <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
            {value}
          </span>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
            {title}
          </p>
        </div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:text-slate-600`}>
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-end justify-between mt-3">
        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">
          {subtext}
        </span>
        
        {/* SVG Sparkline Sparking */}
        <div className="w-20 h-8 opacity-75 dark:opacity-90">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 100 20">
            <path
              d={sparklinePath}
              fill="none"
              stroke={colorClass.spark}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6 pb-24">
      {/* Top Welcome Profile and Overview Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950 rounded-full flex items-center justify-center overflow-hidden border-2 border-white dark:border-slate-800 shadow-md">
              {/* Elegant avatar placeholder or custom image */}
              <div className="font-bold text-blue-700 dark:text-blue-300 text-sm">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full"></div>
          </div>
          <div>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Welcome Back,</span>
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 leading-tight">
              {user.name}
            </h2>
          </div>
        </div>

        {/* Quick info or selector */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300">
            Today
          </div>
        </div>
      </div>

      {/* Main Stats Cards Grid - Styled like Mockup */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            Overview
          </h3>
          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium cursor-pointer" onClick={() => onTabChange('logs')}>
            View Detailed Logs
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {renderCard(
            "Calls Outgoing",
            outgoingCount,
            "Today's Dialed",
            {
              bg: "bg-blue-50/50",
              text: "text-blue-600",
              border: "border-slate-100 dark:border-slate-800",
              spark: "#2563eb",
            },
            sparklines.blue,
            () => onTabChange('logs')
          )}

          {renderCard(
            "Calls Incoming",
            incomingCount,
            "Today's Received",
            {
              bg: "bg-amber-50/50",
              text: "text-amber-600",
              border: "border-slate-100 dark:border-slate-800",
              spark: "#ea580c",
            },
            sparklines.orange,
            () => onTabChange('logs')
          )}

          {renderCard(
            "Guests Welcomed",
            guestCount,
            "In Reception",
            {
              bg: "bg-sky-50/50",
              text: "text-sky-600",
              border: "border-slate-100 dark:border-slate-800",
              spark: "#0284c7",
            },
            sparklines.sky,
            () => onTabChange('logs')
          )}

          {renderCard(
            "Students Enrolled",
            enrolledCount,
            "Admissions Done",
            {
              bg: "bg-emerald-50/50",
              text: "text-emerald-600",
              border: "border-slate-100 dark:border-slate-800",
              spark: "#16a34a",
            },
            sparklines.green,
            () => onTabChange('logs')
          )}

          {renderCard(
            "Inquiries Handled",
            inquiriesCount,
            "Client Requests",
            {
              bg: "bg-purple-50/50",
              text: "text-purple-600",
              border: "border-slate-100 dark:border-slate-800",
              spark: "#9333ea",
            },
            sparklines.purple,
            () => onTabChange('logs')
          )}

          {renderCard(
            "Pending Tasks",
            pendingTasksCount,
            "Requires Follow-Up",
            {
              bg: "bg-indigo-50/50",
              text: "text-indigo-600",
              border: "border-slate-100 dark:border-slate-800",
              spark: "#4f46e5",
            },
            sparklines.indigo,
            () => onTabChange('tasks')
          )}
        </div>
      </div>

      {/* Quick Access Actions Bar */}
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-6 text-white shadow-lg shadow-blue-500/10">
        <h4 className="text-base font-bold mb-1">Quick Logging Action</h4>
        <p className="text-xs text-blue-100 mb-4 opacity-90">Instant logging helper. Click any activity to log it now.</p>
        <div className="grid grid-cols-5 gap-2">
          {[
            { label: 'Call', type: 'call', icon: PhoneCall, bg: 'bg-white/15 hover:bg-white/25' },
            { label: 'Guest', type: 'guest', icon: UserCheck, bg: 'bg-white/15 hover:bg-white/25' },
            { label: 'Enroll', type: 'enrollment', icon: Award, bg: 'bg-white/15 hover:bg-white/25' },
            { label: 'Inquiry', type: 'inquiry', icon: HelpCircle, bg: 'bg-white/15 hover:bg-white/25' },
            { label: 'Task', type: 'task', icon: CheckCircle, bg: 'bg-white/15 hover:bg-white/25' },
          ].map((action) => (
            <button
              key={action.type}
              onClick={() => onQuickAction(action.type as any)}
              className={`flex flex-col items-center justify-center p-2 rounded-2xl transition ${action.bg} cursor-pointer`}
            >
              <action.icon className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-medium tracking-wide">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity List preview */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            Today's Log Activity Timeline
          </h4>
          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium cursor-pointer" onClick={() => onTabChange('logs')}>
            See All
          </span>
        </div>

        {todayCalls.length === 0 && todayGuests.length === 0 && todayEnrollments.length === 0 && todayInquiries.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400 dark:text-slate-500 flex flex-col items-center justify-center gap-2">
            <AlertCircle className="w-8 h-8 text-slate-300 dark:text-slate-700" />
            No activities logged yet today. Use the Quick Logging buttons above!
          </div>
        ) : (
          <div className="space-y-3.5 max-h-56 overflow-y-auto pr-1">
            {todayCalls.map((call) => (
              <div key={call.id} className="flex gap-3 text-xs items-start bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100/50 dark:border-slate-800">
                <div className={`p-1.5 rounded-lg ${call.type === 'outgoing' ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400' : 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400'}`}>
                  <PhoneCall className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {call.type === 'outgoing' ? 'Outgoing Call' : 'Incoming Call'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(call.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                    {call.phoneNumber} {call.contactName ? `(${call.contactName})` : ''}
                  </p>
                  {call.notes && <p className="text-[11px] text-slate-400 dark:text-slate-500 italic mt-0.5">"{call.notes}"</p>}
                </div>
              </div>
            ))}

            {todayGuests.map((guest) => (
              <div key={guest.id} className="flex gap-3 text-xs items-start bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100/50 dark:border-slate-800">
                <div className="p-1.5 rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400">
                  <UserCheck className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Guest Received
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(guest.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {guest.guestName || 'Unnamed Guest'} ({guest.count} guests)
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                    Purpose: <span className="font-medium text-slate-600 dark:text-slate-300">{guest.purpose}</span>
                  </p>
                </div>
              </div>
            ))}

            {todayEnrollments.map((enr) => (
              <div key={enr.id} className="flex gap-3 text-xs items-start bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100/50 dark:border-slate-800">
                <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                  <Award className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Enrollment Completed
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(enr.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {enr.studentName} — <span className="font-medium text-slate-600 dark:text-slate-300">{enr.program}</span>
                  </p>
                </div>
              </div>
            ))}

            {todayInquiries.map((inq) => (
              <div key={inq.id} className="flex gap-3 text-xs items-start bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100/50 dark:border-slate-800">
                <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
                  <HelpCircle className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Inquiry Handled ({inq.type})
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(inq.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {inq.details}
                  </p>
                  <span className={`inline-block text-[9px] px-1.5 py-0.5 font-bold rounded-md mt-1 ${inq.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400' : 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400'}`}>
                    {inq.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
