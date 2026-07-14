/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Home, ClipboardList, Plus, Calendar, FileText, User, X, Phone, HelpCircle, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';

interface LayoutProps {
  user: UserProfile;
  activeTab: 'dashboard' | 'logs' | 'tasks' | 'reports' | 'profile';
  setActiveTab: (tab: 'dashboard' | 'logs' | 'tasks' | 'reports' | 'profile') => void;
  onQuickAction: (actionType: 'call' | 'guest' | 'enrollment' | 'inquiry' | 'task') => void;
  children: React.ReactNode;
}

export default function Layout({
  user,
  activeTab,
  setActiveTab,
  onQuickAction,
  children,
}: LayoutProps) {
  const [showQuickAddMenu, setShowQuickAddMenu] = useState(false);

  const handleQuickAddClick = (type: 'call' | 'guest' | 'enrollment' | 'inquiry' | 'task') => {
    setShowQuickAddMenu(false);
    onQuickAction(type);
  };

  return (
    <div className="min-h-screen bg-[#f3f7fd] dark:bg-slate-950 flex justify-center items-center p-0 md:p-6 transition-colors">
      {/* Phone chassis frame to match the high-end mockup illustration */}
      <div className="w-full max-w-md h-screen md:h-[840px] bg-[#fcfdfe] dark:bg-slate-900 md:rounded-[40px] md:shadow-2xl md:shadow-blue-900/10 border-0 md:border-8 border-slate-900 dark:border-slate-800 flex flex-col overflow-hidden relative font-sans">
        
        {/* Phone Notch/Status bar simulation on desktop */}
        <div className="hidden md:flex justify-between items-center px-6 py-2.5 bg-[#fcfdfe] dark:bg-slate-900 text-xs text-slate-500 font-bold tracking-tight">
          <span>9:41 AM</span>
          <div className="w-24 h-4.5 bg-black rounded-full mx-auto relative flex items-center justify-center">
            <span className="w-1.5 h-1.5 bg-neutral-800 rounded-full absolute right-4"></span>
          </div>
          <div className="flex items-center gap-1">
            <span>5G</span>
            <div className="w-5 h-2.5 border border-slate-400 rounded-sm p-0.5 flex">
              <div className="h-full w-3.5 bg-slate-600 rounded-2xs"></div>
            </div>
          </div>
        </div>

        {/* Customized Header Bar */}
        <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white/70 dark:bg-slate-900/70 backdrop-blur-md z-30 sticky top-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
              <ClipboardList className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-xs font-black tracking-wider uppercase text-blue-600 dark:text-blue-400">
                Reporter
              </h1>
              <span className="text-[10px] text-slate-400 font-bold">Daily Activity</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition ${
                activeTab === 'profile'
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
              }`}
              title="Settings"
            >
              <Settings className="w-4.5 h-4.5" />
            </button>
          </div>
        </header>



        {/* Quick Add Bottom Drawer Menu */}
        <AnimatePresence>
          {showQuickAddMenu && (
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs z-40 flex items-end justify-center">
              <motion.div
                initial={{ y: 150 }}
                animate={{ y: 0 }}
                exit={{ y: 150 }}
                className="w-full bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 rounded-t-[32px] p-6 shadow-2xl space-y-4"
              >
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2 mb-2">
                  <span className="text-xs font-black tracking-wider uppercase text-slate-400">
                    Quick Log Activities
                  </span>
                  <button onClick={() => setShowQuickAddMenu(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <button
                    onClick={() => handleQuickAddClick('call')}
                    className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-left cursor-pointer transition"
                  >
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center">
                      <Phone className="w-4 h-4" />
                    </div>
                    Log Call
                  </button>
                  <button
                    onClick={() => handleQuickAddClick('guest')}
                    className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-left cursor-pointer transition"
                  >
                    <div className="w-8 h-8 bg-sky-100 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    Log Guest
                  </button>
                  <button
                    onClick={() => handleQuickAddClick('enrollment')}
                    className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-left cursor-pointer transition"
                  >
                    <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4" />
                    </div>
                    Enrollment
                  </button>
                  <button
                    onClick={() => handleQuickAddClick('inquiry')}
                    className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-left cursor-pointer transition"
                  >
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 rounded-lg flex items-center justify-center">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    Inquiry
                  </button>
                  <button
                    onClick={() => handleQuickAddClick('task')}
                    className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-left cursor-pointer col-span-2 transition"
                  >
                    <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center">
                      <Plus className="w-4 h-4" />
                    </div>
                    Create Follow-Up Task
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Scrollable Screen Content */}
        <main className="flex-1 overflow-y-auto px-5 pt-5 pb-8 scrollbar-none">
          {children}
        </main>

        {/* Floating action button on the right */}
        <div className="absolute bottom-22 right-5 z-40">
          <button
            onClick={() => setShowQuickAddMenu(true)}
            className="w-13 h-13 bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 cursor-pointer transform hover:scale-105 active:scale-95 transition animate-bounce-subtle"
          >
            <Plus className="w-6.5 h-6.5 font-bold" />
          </button>
        </div>

        {/* Navigation Bar - Matching the mockup bottom bar */}
        <nav className="border-t border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 py-3.5 flex justify-between items-center z-30 relative shrink-0">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center gap-1 cursor-pointer transition ${
              activeTab === 'dashboard' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Home className="w-5.5 h-5.5" />
            <span className="text-[9px] font-bold">Home</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`flex flex-col items-center gap-1 cursor-pointer transition ${
              activeTab === 'logs' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <ClipboardList className="w-5.5 h-5.5" />
            <span className="text-[9px] font-bold">Logs</span>
          </button>

          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex flex-col items-center gap-1 cursor-pointer transition ${
              activeTab === 'tasks' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Calendar className="w-5.5 h-5.5" />
            <span className="text-[9px] font-bold">Tasks</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`flex flex-col items-center gap-1 cursor-pointer transition ${
              activeTab === 'reports' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <FileText className="w-5.5 h-5.5" />
            <span className="text-[9px] font-bold">Reports</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
