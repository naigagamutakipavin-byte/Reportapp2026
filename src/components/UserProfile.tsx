/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { User, Mail, Shield, Briefcase, Building, Moon, Sun, LogOut, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { UserProfile as ProfileType } from '../types';

interface UserProfileProps {
  user: ProfileType;
  onUpdate: (updated: ProfileType) => void;
  onLogout: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function UserProfile({
  user,
  onUpdate,
  onLogout,
  darkMode,
  onToggleDarkMode,
}: UserProfileProps) {
  const [name, setName] = React.useState(user.name);
  const [email, setEmail] = React.useState(user.email);
  const [role, setRole] = React.useState(user.role);
  const [department, setDepartment] = React.useState(user.department);
  const [companyName, setCompanyName] = React.useState(user.companyName);
  const [isSaved, setIsSaved] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      name,
      email,
      role,
      department,
      companyName,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          Employee Profile Settings
        </h3>
      </div>

      {/* User Info Overview */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center font-bold text-xl uppercase border-2 border-white/40">
            {user.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h4 className="text-lg font-bold">{user.name}</h4>
            <p className="text-xs text-blue-100 mt-0.5">{user.role} | {user.department}</p>
            <p className="text-xs text-blue-200/80 mt-1 font-mono">{user.email}</p>
          </div>
        </div>
      </div>

      {/* System Settings & Dark Mode */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <h5 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-4">
          Preferences
        </h5>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {darkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-indigo-500" />}
            </div>
            <div>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100 block">Dark Mode</span>
              <span className="text-xs text-slate-400">Reduce eye strain during night shifts</span>
            </div>
          </div>
          <button
            onClick={onToggleDarkMode}
            className={`w-12 h-6 rounded-full p-1 transition cursor-pointer ${
              darkMode ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'
            }`}
          >
            <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
              darkMode ? 'translate-x-6' : 'translate-x-0'
            }`}></div>
          </button>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <h5 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-4">
          Update Information
        </h5>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <User className="w-4.5 h-4.5" />
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/50 border-0 focus:ring-2 focus:ring-blue-500 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 dark:text-slate-100"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">
              Work Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Mail className="w-4.5 h-4.5" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/50 border-0 focus:ring-2 focus:ring-blue-500 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 dark:text-slate-100"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">
                Job Role
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Briefcase className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border-0 focus:ring-2 focus:ring-blue-500 rounded-xl py-2.5 pl-9 pr-3 text-xs text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">
                Department
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Building className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border-0 focus:ring-2 focus:ring-blue-500 rounded-xl py-2.5 pl-9 pr-3 text-xs text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">
              Company / School Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Building className="w-4.5 h-4.5" />
              </span>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/50 border-0 focus:ring-2 focus:ring-blue-500 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl py-3 text-xs shadow-md shadow-blue-500/15 cursor-pointer transition flex items-center justify-center gap-1.5"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4" />
                  Saved Changes
                </>
              ) : (
                'Save Profile Updates'
              )}
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="px-4 py-3 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 text-red-600 rounded-xl text-xs font-bold cursor-pointer transition flex items-center gap-1"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
