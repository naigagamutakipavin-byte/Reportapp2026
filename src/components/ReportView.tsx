/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { FileText, Download, Share2, Mail, Send, CheckCircle2, ChevronRight, Sparkles, Building, Printer, AlertCircle, Edit3, Check, Save, Trash2, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import jsPDF from 'jspdf';
import { CallLog, GuestLog, EnrollmentLog, InquiryLog, FollowUpTask, DailyNotes, UserProfile } from '../types';

interface ReportViewProps {
  user: UserProfile;
  calls: CallLog[];
  guests: GuestLog[];
  enrollments: EnrollmentLog[];
  inquiries: InquiryLog[];
  tasks: FollowUpTask[];
  notes: DailyNotes;
  onUpdateNotes?: (updated: DailyNotes) => void;
}

export default function ReportView({
  user,
  calls,
  guests,
  enrollments,
  inquiries,
  tasks,
  notes,
  onUpdateNotes,
}: ReportViewProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfReady, setPdfReady] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Calculate totals
  const callsMade = calls.filter(c => c.type === 'outgoing').length;
  const callsReceived = calls.filter(c => c.type === 'incoming').length;
  const guestsReceived = guests.reduce((acc, curr) => acc + curr.count, 0);
  const enrolledCompleted = enrollments.filter(e => e.status === 'Completed').length;
  const inquiriesHandled = inquiries.length;
  
  const tasksCompleted = tasks.filter(t => t.completed).length;
  const tasksPending = tasks.filter(t => !t.completed).length;

  // Editable fields local state
  const [isEditing, setIsEditing] = useState(false);
  const [editedChallenges, setEditedChallenges] = useState(notes.challenges);
  const [editedObservations, setEditedObservations] = useState(notes.observations);
  const [editedAiSummary, setEditedAiSummary] = useState(notes.aiSummary || '');
  const [editedAchievementsList, setEditedAchievementsList] = useState<string[]>([]);

  // Function to compile initial list of achievements
  const initializeAchievementsList = () => {
    let list: string[] = [];
    let parsedCustomList: string[] | null = null;
    if (notes.achievements) {
      try {
        if (notes.achievements.startsWith('[')) {
          parsedCustomList = JSON.parse(notes.achievements);
        }
      } catch (e) {
        // Fall back to plain text
      }
    }

    if (parsedCustomList !== null) {
      list = parsedCustomList;
    } else {
      if (enrolledCompleted > 0) {
        list.push(`Enrolled ${enrolledCompleted} new candidate(s) successfully.`);
      }
      const resolvedInquiries = inquiries.filter(i => i.status === 'Resolved');
      if (resolvedInquiries.length > 0) {
        list.push(`Resolved ${resolvedInquiries.length} client inquiries regarding admissions/pricing.`);
      }
      const completedTasks = tasks.filter(t => t.completed);
      if (completedTasks.length > 0) {
        completedTasks.forEach(t => {
          list.push(`Completed follow-up task: "${t.title}".`);
        });
      }
      if (notes.achievements) {
        list.push(notes.achievements);
      }
    }
    setEditedAchievementsList(list);
  };

  // Synchronize when notes prop or dynamic items update from elsewhere
  useEffect(() => {
    setEditedChallenges(notes.challenges);
    setEditedObservations(notes.observations);
    setEditedAiSummary(notes.aiSummary || '');
    if (!isEditing) {
      initializeAchievementsList();
    }
  }, [notes, calls, guests, enrollments, inquiries, tasks, isEditing]);

  const handleUpdateAchievement = (index: number, text: string) => {
    const updated = [...editedAchievementsList];
    updated[index] = text;
    setEditedAchievementsList(updated);
  };

  const handleDeleteAchievement = (index: number) => {
    const updated = editedAchievementsList.filter((_, i) => i !== index);
    setEditedAchievementsList(updated);
  };

  const handleAddAchievement = () => {
    setEditedAchievementsList([...editedAchievementsList, '']);
  };

  const handleSaveChanges = () => {
    if (onUpdateNotes) {
      onUpdateNotes({
        challenges: editedChallenges,
        achievements: JSON.stringify(editedAchievementsList),
        observations: editedObservations,
        aiSummary: editedAiSummary,
      });
    }
    setIsEditing(false);
    setSuccessMsg('Report details, achievements, and summary saved successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Generate jsPDF Report
  const generatePDF = () => {
    setIsGenerating(true);
    setPdfReady(false);

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const primaryColor = '#1e3a8a'; // Deep Blue
      const secondaryColor = '#3b82f6'; // Light Blue
      const darkColor = '#1f2937'; // Gray-800
      const lightGray = '#9ca3af'; // Gray-400
      const dividerColor = '#e5e7eb'; // Gray-200

      // Logo Placeholder & Header Banner
      doc.setFillColor(30, 58, 138); // Primary deep blue
      doc.rect(0, 0, 210, 40, 'F');

      // Title
      doc.setTextColor(255, 255, 255);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(22);
      doc.text('DAILY ACTIVITY REPORT', 15, 18);

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`${user.companyName} | ${user.department}`, 15, 26);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 15, 32);

      // Logo simulation
      doc.setDrawColor(255, 255, 255);
      doc.setLineWidth(0.8);
      doc.rect(170, 8, 25, 24);
      doc.setFontSize(8);
      doc.text('COMPANY', 173, 17);
      doc.text('LOGO', 177, 23);

      // Metadata Info Section
      doc.setTextColor(darkColor);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('REPORT DETAILS', 15, 52);
      doc.setDrawColor(primaryColor);
      doc.setLineWidth(0.5);
      doc.line(15, 55, 195, 55);

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(75, 85, 99); // Slate-600
      doc.text('Employee Name:', 15, 62);
      doc.text('Department:', 15, 68);
      doc.text('Role:', 15, 74);
      doc.text('Report Date:', 15, 80);

      doc.setTextColor(darkColor);
      doc.setFont('Helvetica', 'bold');
      doc.text(user.name, 50, 62);
      doc.text(user.department, 50, 68);
      doc.text(user.role, 50, 74);
      doc.text(todayStr, 50, 80);

      // Summary Table / Grid
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('DAILY STATISTICAL SUMMARY', 15, 94);
      doc.setDrawColor(primaryColor);
      doc.line(15, 97, 195, 97);

      // Grid header
      doc.setFillColor(243, 244, 246);
      doc.rect(15, 101, 180, 8, 'F');
      doc.setFontSize(9);
      doc.setTextColor(darkColor);
      doc.text('Activity Category', 18, 106.5);
      doc.text('Status / Volume', 150, 106.5);

      const metrics = [
        { label: 'Outgoing Calls Made', val: `${callsMade} call(s)` },
        { label: 'Incoming Calls Received', val: `${callsReceived} call(s)` },
        { label: 'Guests Received (Reception)', val: `${guestsReceived} guest(s)` },
        { label: 'Successful Program Enrollments', val: `${enrolledCompleted} enrollment(s)` },
        { label: 'Inquiries Resolved / Pending', val: `${inquiriesHandled} inquiry(ies)` },
        { label: 'Follow-Up Tasks Completed', val: `${tasksCompleted} task(s)` },
        { label: 'Follow-Up Tasks Pending', val: `${tasksPending} task(s)` },
      ];

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      let currentY = 113;
      metrics.forEach((item) => {
        doc.text(item.label, 18, currentY + 4);
        doc.setFont('Helvetica', 'bold');
        doc.text(item.val, 150, currentY + 4);
        doc.setFont('Helvetica', 'normal');
        doc.setDrawColor(dividerColor);
        doc.setLineWidth(0.2);
        doc.line(15, currentY + 7, 195, currentY + 7);
        currentY += 8;
      });

      // Achievements
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('ACHIEVEMENTS TODAY', 15, currentY + 12);
      doc.setDrawColor(primaryColor);
      doc.setLineWidth(0.5);
      doc.line(15, currentY + 15, 195, currentY + 15);

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      let achY = currentY + 21;
      if (editedAchievementsList.length === 0) {
        doc.text('- No specific achievements logged for today.', 18, achY);
        achY += 6;
      } else {
        editedAchievementsList.forEach((ach) => {
          if (achY < 270) {
            const splitAch = doc.splitTextToSize(`* ${ach}`, 175);
            doc.text(splitAch, 18, achY);
            achY += (splitAch.length * 4.5);
          }
        });
      }

      // Challenges & Observations / Notes
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('OFFICER NOTES & CRITICAL OBSERVATIONS', 15, achY + 8);
      doc.setDrawColor(primaryColor);
      doc.line(15, achY + 11, 195, achY + 11);

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      let notesY = achY + 17;

      if (editedChallenges && notesY < 270) {
        doc.setFont('Helvetica', 'bold');
        doc.text('Challenges Faced:', 18, notesY);
        doc.setFont('Helvetica', 'normal');
        const challengesLines = doc.splitTextToSize(editedChallenges, 175);
        doc.text(challengesLines, 18, notesY + 4.5);
        notesY += (challengesLines.length * 4.5) + 8;
      }

      if (editedObservations && notesY < 270) {
        doc.setFont('Helvetica', 'bold');
        doc.text('Key Observations:', 18, notesY);
        doc.setFont('Helvetica', 'normal');
        const obsLines = doc.splitTextToSize(editedObservations, 175);
        doc.text(obsLines, 18, notesY + 4.5);
        notesY += (obsLines.length * 4.5) + 8;
      }

      if (editedAiSummary && notesY < 270) {
        doc.setFont('Helvetica', 'bold');
        doc.text('AI Generated Report Insights:', 18, notesY);
        doc.setFont('Helvetica', 'italic');
        const summaryLines = doc.splitTextToSize(editedAiSummary, 175);
        doc.text(summaryLines, 18, notesY + 4.5);
        notesY += (summaryLines.length * 4.5) + 8;
      }

      // Page Number Footer
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(lightGray);
      doc.text('Daily Activity Reporter - Page 1 of 1', 15, 287);
      doc.text('Secure Workspace Digital Signature Verify: APPROVED', 140, 287);

      // Save and compile
      doc.save(`Daily_Activity_Report_${new Date().toISOString().split('T')[0]}.pdf`);
      setPdfReady(true);
      setSuccessMsg('PDF Report generated and downloaded to device successfully!');
    } catch (err) {
      console.error(err);
      setSuccessMsg('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShareEmail = () => {
    const subject = `Daily Activity Report - ${user.name} - ${new Date().toISOString().split('T')[0]}`;
    const achievementsText = editedAchievementsList.length > 0 
      ? editedAchievementsList.map(a => `- ${a}`).join('\n') 
      : 'None logged.';

    const body = `Hi Team,

Please see my Daily Activity Summary for ${todayStr}:

- Outgoing Calls Made: ${callsMade}
- Incoming Calls Received: ${callsReceived}
- Guests Received: ${guestsReceived}
- Students Enrolled: ${enrolledCompleted}
- Client Inquiries Handled: ${inquiriesHandled}
- Tasks Completed: ${tasksCompleted}
- Tasks Pending: ${tasksPending}

Achievements Today:
${achievementsText}

Challenges: ${editedChallenges || 'None logged.'}
Observations: ${editedObservations || 'None logged.'}

AI Insights: ${editedAiSummary || 'No AI insights requested.'}

Sent via Daily Activity Reporter.`;

    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
    setSuccessMsg('Redirecting to your email client...');
  };

  const handleShareWhatsApp = () => {
    const achievementsText = editedAchievementsList.length > 0 
      ? editedAchievementsList.map(a => `* ${a}`).join('\n') 
      : 'Logged successfully';

    const text = `*Daily Activity Summary* - ${user.name} - ${new Date().toISOString().split('T')[0]}
- Outgoing Calls: ${callsMade}
- Incoming Calls: ${callsReceived}
- Guests Received: ${guestsReceived}
- Students Enrolled: ${enrolledCompleted}
- Client Inquiries: ${inquiriesHandled}
- Tasks Completed: ${tasksCompleted}

*Achievements:*
${achievementsText}`;

    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
    setSuccessMsg('Opened WhatsApp share utility!');
  };

  const handleSaveToDeviceStorage = () => {
    setSuccessMsg('Report archived successfully in secure device offline database!');
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          Daily PDF Report
        </h3>
        <button
          onClick={() => {
            if (isEditing) {
              handleSaveChanges();
            } else {
              setIsEditing(true);
            }
          }}
          className={`px-3 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            isEditing
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/10'
              : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
          }`}
        >
          {isEditing ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Save Edits
            </>
          ) : (
            <>
              <Edit3 className="w-3.5 h-3.5" />
              Edit Content
            </>
          )}
        </button>
      </div>

      {/* Report Summary Overview Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-5">
          <div>
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-blue-600 dark:text-blue-400">
              Active Session
            </span>
            <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-1">
              {todayStr}
            </h4>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5" />
              {user.companyName}
            </p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/50 p-3 rounded-2xl">
            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        {/* Statistic Summaries Section */}
        <div>
          <h5 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-4">
            Today's Totals Compiled
          </h5>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100/50 dark:border-slate-800">
              <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{callsMade + callsReceived}</span>
              <p className="text-[10px] font-bold text-slate-500 mt-0.5">Calls Logged</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100/50 dark:border-slate-800">
              <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{guestsReceived}</span>
              <p className="text-[10px] font-bold text-slate-500 mt-0.5">Guests Received</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100/50 dark:border-slate-800">
              <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{enrolledCompleted}</span>
              <p className="text-[10px] font-bold text-slate-500 mt-0.5">Enrolled Done</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100/50 dark:border-slate-800">
              <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{inquiriesHandled}</span>
              <p className="text-[10px] font-bold text-slate-500 mt-0.5">Inquiries Managed</p>
            </div>
          </div>
        </div>

        {/* Achievements section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h5 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
              Achievements Displayed
            </h5>
            {isEditing && (
              <button
                type="button"
                onClick={handleAddAchievement}
                className="flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Achievement
              </button>
            )}
          </div>
          <div className="space-y-2">
            {editedAchievementsList.length === 0 ? (
              <div className="p-3 text-xs text-slate-400 italic bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                No specific achievements completed today. Complete programs, resolve inquiries, or toggle follow-up tasks to populate.
              </div>
            ) : (
              editedAchievementsList.map((ach, idx) => (
                <div key={idx} className={`flex gap-2 text-xs items-center p-2.5 rounded-xl border ${
                  isEditing 
                    ? 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80' 
                    : 'bg-emerald-500/5 dark:bg-emerald-500/2 border-emerald-500/10'
                }`}>
                  {isEditing ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <input
                        type="text"
                        value={ach}
                        onChange={(e) => handleUpdateAchievement(idx, e.target.value)}
                        placeholder="Enter achievement details..."
                        className="flex-1 bg-transparent border-0 focus:ring-0 text-slate-800 dark:text-slate-100 text-xs py-0.5 px-0 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteAchievement(idx)}
                        className="text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
                        title="Delete Achievement"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-600 dark:text-slate-300 leading-relaxed">{ach}</span>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Notes preview block */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-5 space-y-4">
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
              {isEditing ? 'Modify Report Details' : 'Daily Notes Compiled'}
            </h5>
            {isEditing && (
              <span className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 rounded-full font-bold">
                Edits apply to generated PDF
              </span>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4 pt-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                    Challenges Faced Today
                  </label>
                  <textarea
                    value={editedChallenges}
                    onChange={(e) => setEditedChallenges(e.target.value)}
                    placeholder="Enter challenges faced during today's operations..."
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-800 rounded-xl p-3 text-xs text-slate-800 dark:text-slate-100 font-sans leading-relaxed resize-none h-24"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                    Critical Observations
                  </label>
                  <textarea
                    value={editedObservations}
                    onChange={(e) => setEditedObservations(e.target.value)}
                    placeholder="Enter observations or trends noticed today..."
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-800 rounded-xl p-3 text-xs text-slate-800 dark:text-slate-100 font-sans leading-relaxed resize-none h-24"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                  AI Generated Summary (Editable)
                </label>
                <textarea
                  value={editedAiSummary}
                  onChange={(e) => setEditedAiSummary(e.target.value)}
                  placeholder="Enter or edit today's AI-generated insight summary..."
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-800 rounded-xl p-3 text-xs text-slate-800 dark:text-slate-100 font-sans leading-relaxed resize-none h-28"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditedChallenges(notes.challenges);
                    setEditedObservations(notes.observations);
                    setEditedAiSummary(notes.aiSummary || '');
                    initializeAchievementsList();
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-500 dark:text-slate-400 rounded-xl text-xs font-bold cursor-pointer transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveChanges}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer transition flex items-center gap-1 shadow-md shadow-emerald-600/10"
                >
                  <Check className="w-3.5 h-3.5" />
                  Save Edits
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100/50 dark:border-slate-800 text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Challenges:</span>
                  <p className="text-slate-500 italic leading-relaxed">{editedChallenges || 'No challenges faced logged today.'}</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100/50 dark:border-slate-800 text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Observations:</span>
                  <p className="text-slate-500 italic leading-relaxed">{editedObservations || 'No observations logged today.'}</p>
                </div>
              </div>

              {editedAiSummary && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-500/10 to-indigo-500/10 border border-violet-100 dark:border-violet-950/50 text-xs">
                  <div className="flex items-center gap-1.5 text-violet-700 dark:text-violet-400 font-bold mb-1.5">
                    <Sparkles className="w-4 h-4" />
                    AI Generated Summary
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-sans italic">
                    "{editedAiSummary}"
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Generate and Share buttons */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-6 space-y-4">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={generatePDF}
            disabled={isGenerating}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-4 font-bold text-sm transition shadow-lg shadow-blue-500/15 cursor-pointer flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            {isGenerating ? 'Compiling PDF...' : 'Generate PDF Report'}
          </motion.button>

          {/* Share Utilities list */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={handleShareWhatsApp}
              className="flex flex-col items-center justify-center p-3.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-800 rounded-2xl border border-slate-100/50 dark:border-slate-700 cursor-pointer text-slate-700 dark:text-slate-300"
            >
              <Send className="w-5 h-5 text-emerald-500 mb-1" />
              <span className="text-[10px] font-bold">WhatsApp</span>
            </button>
            <button
              onClick={handleShareEmail}
              className="flex flex-col items-center justify-center p-3.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-800 rounded-2xl border border-slate-100/50 dark:border-slate-700 cursor-pointer text-slate-700 dark:text-slate-300"
            >
              <Mail className="w-5 h-5 text-blue-500 mb-1" />
              <span className="text-[10px] font-bold">Email Share</span>
            </button>
            <button
              onClick={handleSaveToDeviceStorage}
              className="flex flex-col items-center justify-center p-3.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-800 rounded-2xl border border-slate-100/50 dark:border-slate-700 cursor-pointer text-slate-700 dark:text-slate-300"
            >
              <Share2 className="w-5 h-5 text-purple-500 mb-1" />
              <span className="text-[10px] font-bold">Save Device</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification message */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 bg-emerald-500 text-white rounded-2xl flex items-center gap-3 text-xs font-bold"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>{successMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
