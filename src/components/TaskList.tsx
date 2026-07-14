/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Calendar, CheckCircle2, Circle, Clock, Plus, Trash2, Pencil, CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FollowUpTask } from '../types';

interface TaskListProps {
  tasks: FollowUpTask[];
  onAddTask: (task: Omit<FollowUpTask, 'id' | 'completed'>) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (id: string, updatedFields: Partial<Omit<FollowUpTask, 'id'>>) => void;
}

export default function TaskList({
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onEditTask,
}: TaskListProps) {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskNotes, setNewTaskNotes] = useState('');

  // Task Editing states
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTaskTitle, setEditTaskTitle] = useState('');
  const [editTaskNotes, setEditTaskNotes] = useState('');
  const [editTaskDueDate, setEditTaskDueDate] = useState('');

  const startEditing = (task: FollowUpTask) => {
    setEditingTaskId(task.id);
    setEditTaskTitle(task.title);
    setEditTaskNotes(task.notes || '');
    setEditTaskDueDate(task.dueDate);
  };

  const handleSaveEdit = (id: string) => {
    if (!editTaskTitle.trim()) return;
    onEditTask(id, {
      title: editTaskTitle.trim(),
      notes: editTaskNotes.trim() || undefined,
      dueDate: editTaskDueDate,
    });
    setEditingTaskId(null);
  };

  // Weekly calendar logic
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

  const getWeekDays = () => {
    const days = [];
    const baseDate = new Date();
    // Adjust base date by the offset (weeks)
    baseDate.setDate(baseDate.getDate() + (currentWeekOffset * 7));
    
    // Find Sunday of this week
    const dayOfWeek = baseDate.getDay();
    const sunday = new Date(baseDate);
    sunday.setDate(baseDate.getDate() - dayOfWeek);

    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < 7; i++) {
      const d = new Date(sunday);
      d.setDate(sunday.getDate() + i);
      const dateString = d.toISOString().split('T')[0];
      days.push({
        dayName: weekdays[i],
        dayNum: d.getDate(),
        dateString,
        isToday: d.toISOString().split('T')[0] === new Date().toISOString().split('T')[0],
      });
    }
    return days;
  };

  const weekDays = getWeekDays();

  // Selected date formatted beautifully
  const formatSelectedDate = () => {
    const d = new Date(selectedDate);
    return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const filteredTasks = tasks.filter((task) => task.dueDate === selectedDate);

  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;
    onAddTask({
      title: newTaskTitle,
      dueDate: selectedDate,
      notes: newTaskNotes || undefined,
    });
    setNewTaskTitle('');
    setNewTaskNotes('');
    setIsAdding(false);
  };

  // Helper to count tasks for a date to show dots on calendar
  const getTaskDots = (dateStr: string) => {
    const dateTasks = tasks.filter((t) => t.dueDate === dateStr);
    if (dateTasks.length === 0) return null;
    const completed = dateTasks.filter((t) => t.completed).length;
    const pending = dateTasks.length - completed;
    return (
      <div className="flex gap-1 justify-center mt-1">
        {pending > 0 && <span className="w-1.5 h-1.5 bg-violet-500 rounded-full"></span>}
        {completed > 0 && <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>}
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Calendar view matching mockup */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              {formatSelectedDate()}
            </h3>
          </div>
          <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 p-1 rounded-xl border border-slate-100 dark:border-slate-700">
            <button
              onClick={() => setCurrentWeekOffset(prev => prev - 1)}
              className="p-1.5 text-slate-500 hover:text-slate-700 cursor-pointer rounded-lg hover:bg-slate-150"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentWeekOffset(0)}
              className="text-[10px] font-bold px-2 py-1 text-slate-600 dark:text-slate-400 cursor-pointer"
            >
              Today
            </button>
            <button
              onClick={() => setCurrentWeekOffset(prev => prev + 1)}
              className="p-1.5 text-slate-500 hover:text-slate-700 cursor-pointer rounded-lg hover:bg-slate-150"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sun-Sat week columns */}
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day) => {
            const isSelected = day.dateString === selectedDate;
            return (
              <div
                key={day.dateString}
                onClick={() => setSelectedDate(day.dateString)}
                className={`flex flex-col items-center p-2.5 rounded-2xl cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                  isSelected ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'
                }`}>
                  {day.dayName}
                </span>
                <span className={`text-sm font-extrabold mt-1.5 ${
                  day.isToday && !isSelected ? 'text-blue-600 dark:text-blue-400 font-black' : ''
                }`}>
                  {day.dayNum}
                </span>
                {getTaskDots(day.dateString)}
              </div>
            );
          })}
        </div>
      </div>

      {/* Task List Header and action button */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            Today's Follow-Ups
          </h4>
          <p className="text-xs text-slate-400">
            {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'} scheduled for this date
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1.5 bg-blue-600 text-white px-3.5 py-2 rounded-2xl text-xs font-bold shadow-md shadow-blue-500/15 hover:bg-blue-700 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Task
        </motion.button>
      </div>

      {/* Add Task Form Dialog/Collapsible */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleAddTaskSubmit} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 space-y-4 shadow-sm">
              <h5 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
                New Follow-Up Task
              </h5>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Call Alice regarding pending documents"
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border-0 focus:ring-2 focus:ring-blue-500 rounded-xl py-2.5 px-3.5 text-xs text-slate-800 dark:text-slate-100"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Task Notes (Optional)
                </label>
                <input
                  type="text"
                  value={newTaskNotes}
                  onChange={(e) => setNewTaskNotes(e.target.value)}
                  placeholder="e.g. Prefers email communication if no answer"
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border-0 focus:ring-2 focus:ring-blue-500 rounded-xl py-2.5 px-3.5 text-xs text-slate-800 dark:text-slate-100"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/10 cursor-pointer"
                >
                  Save Task
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task list matching right panel of mockup */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-2">
            <Clock className="w-8 h-8 text-slate-300 dark:text-slate-700" />
            No follow-ups scheduled for this day.
          </div>
        ) : (
          filteredTasks.map((task) => {
            if (editingTaskId === task.id) {
              return (
                <motion.div
                  key={task.id}
                  layout
                  className="p-5 bg-slate-50 dark:bg-slate-900 border border-blue-100 dark:border-blue-900/30 rounded-2xl space-y-4 shadow-inner"
                >
                  <div className="flex justify-between items-center">
                    <h5 className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                      Edit Follow-Up Task
                    </h5>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Task Title
                      </label>
                      <input
                        type="text"
                        value={editTaskTitle}
                        onChange={(e) => setEditTaskTitle(e.target.value)}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 rounded-xl py-2 px-3 text-xs text-slate-800 dark:text-slate-100"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Task Notes (Optional)
                      </label>
                      <input
                        type="text"
                        value={editTaskNotes}
                        onChange={(e) => setEditTaskNotes(e.target.value)}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 rounded-xl py-2 px-3 text-xs text-slate-800 dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={editTaskDueDate}
                        onChange={(e) => setEditTaskDueDate(e.target.value)}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 rounded-xl py-2 px-3 text-xs text-slate-800 dark:text-slate-100"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => setEditingTaskId(null)}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-500 bg-white hover:bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveEdit(task.id)}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/10 cursor-pointer"
                    >
                      Save Changes
                    </button>
                  </div>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={task.id}
                layout
                className={`flex items-center justify-between p-4 bg-white dark:bg-slate-900 border rounded-2xl transition-all ${
                  task.completed
                    ? 'border-emerald-100 bg-emerald-50/5 dark:border-emerald-950/20'
                    : 'border-slate-100 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3.5 flex-1 pr-4">
                  <button
                    onClick={() => onToggleTask(task.id)}
                    className="text-slate-300 hover:text-blue-600 cursor-pointer"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5.5 h-5.5 text-emerald-500" />
                    ) : (
                      <Circle className="w-5.5 h-5.5 text-slate-300 dark:text-slate-600" />
                    )}
                  </button>
                  <div>
                    <span className={`text-xs font-bold ${
                      task.completed
                        ? 'line-through text-slate-400 dark:text-slate-500 font-medium'
                        : 'text-slate-800 dark:text-slate-100'
                    }`}>
                      {task.title}
                    </span>
                    {task.notes && (
                      <p className={`text-[11px] mt-0.5 ${
                        task.completed ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'
                      }`}>
                        {task.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => startEditing(task)}
                    className="text-slate-300 hover:text-blue-500 p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/20 transition cursor-pointer"
                    title="Edit Task"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="text-slate-300 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition cursor-pointer"
                    title="Delete Task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
