import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../api/apiClient.ts';
import { Roadmap, RoadmapTask } from '../../types/index.ts';
import {
  Map,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  Plus,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const RoadmapPage: React.FC = () => {
  const { user } = useAuth();
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedPhase, setSelectedPhase] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchRoadmap = async () => {
    try {
      const res = await api.getRoadmap();
      setRoadmap(res.roadmap);
    } catch (err) {
      console.warn('Error loading roadmap:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const handleToggleTask = async (task: RoadmapTask) => {
    if (!roadmap) return;
    const newStatus = task.status === 'COMPLETED' ? 'TODO' : 'COMPLETED';

    try {
      const res = await api.updateRoadmapTaskStatus(roadmap.id, task.id, newStatus);
      setRoadmap(res.roadmap);

      if (newStatus === 'COMPLETED') {
        try {
          confetti({
            particleCount: 50,
            spread: 50,
            origin: { y: 0.7 }
          });
        } catch (e) {
          // ignore
        }
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update task');
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roadmap || !newTaskTitle.trim()) return;

    try {
      const targetPhaseObj = roadmap.phases.find(p => p.phaseNumber === selectedPhase);
      const res = await api.addRoadmapTask({
        roadmapId: roadmap.id,
        phaseNumber: selectedPhase,
        phaseName: targetPhaseObj?.phaseName || 'Milestone Phase',
        title: newTaskTitle.trim(),
        description: 'Custom milestone added during mentorship tracking',
        priority: 'HIGH',
        estimatedTime: '1 week'
      });
      setRoadmap(res.roadmap);
      setNewTaskTitle('');
      setShowAddModal(false);
    } catch (err: any) {
      alert(err.message || 'Failed to add task');
    }
  };

  if (loading || !roadmap) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 animate-pulse space-y-6">
        <div className="h-32 bg-slate-200/70 rounded-3xl"></div>
        <div className="h-64 bg-slate-200/70 rounded-3xl"></div>
      </div>
    );
  }

  const completedCount = roadmap.tasks.filter(t => t.status === 'COMPLETED').length;
  const totalCount = roadmap.tasks.length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-700/60 text-indigo-200 text-xs font-semibold">
            <Map className="w-3.5 h-3.5 text-indigo-300" />
            <span>Interactive Placement Curriculum</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Personalized Career Roadmap
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200 max-w-xl">
            Goal: <strong className="text-white">{roadmap.goal}</strong>
          </p>
        </div>

        {/* Dynamic Career Readiness Calculation */}
        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 shrink-0">
          <div className="text-center px-2">
            <div className="text-3xl font-black text-emerald-400">
              {roadmap.overallProgress}%
            </div>
            <div className="text-[11px] text-indigo-200 font-semibold uppercase tracking-wider">
              Career Readiness
            </div>
          </div>
          <div className="w-px h-10 bg-white/20"></div>
          <div className="text-center px-2">
            <div className="text-2xl font-bold text-white">
              {completedCount} / {totalCount}
            </div>
            <div className="text-[11px] text-indigo-200 font-medium">Tasks Completed</div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500 font-medium">
          Check off tasks as you complete them to watch your career readiness score recalculate in real-time.
        </p>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Milestone</span>
        </button>
      </div>

      {/* Phases and Tasks */}
      <div className="space-y-6">
        {roadmap.phases.map(phase => {
          const phaseTasks = roadmap.tasks.filter(t => t.phaseNumber === phase.phaseNumber);
          const phaseCompleted = phaseTasks.filter(t => t.status === 'COMPLETED').length;

          return (
            <div
              key={phase.phaseNumber}
              className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4"
            >
              {/* Phase Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                      {phase.phaseNumber}
                    </span>
                    <h3 className="font-bold text-base text-slate-900">
                      {phase.phaseName}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {phase.description}
                  </p>
                </div>

                <div className="text-xs font-semibold text-slate-500">
                  {phaseCompleted} of {phaseTasks.length} Done
                </div>
              </div>

              {/* Tasks List */}
              <div className="space-y-2.5">
                {phaseTasks.map(task => {
                  const isDone = task.status === 'COMPLETED';

                  return (
                    <div
                      key={task.id}
                      onClick={() => handleToggleTask(task)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                        isDone
                          ? 'bg-emerald-50/40 border-emerald-200/60 text-slate-500'
                          : 'bg-slate-50/70 hover:bg-white border-slate-200/80 hover:border-indigo-300 text-slate-800'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors"
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                          ) : (
                            <Circle className="w-5 h-5" />
                          )}
                        </button>
                        <div className="space-y-0.5">
                          <h4 className={`text-xs sm:text-sm font-bold ${isDone ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                            {task.title}
                          </h4>
                          <p className={`text-xs ${isDone ? 'text-slate-400' : 'text-slate-600'}`}>
                            {task.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          task.priority === 'HIGH' ? 'bg-red-50 text-red-600 border border-red-200/60' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {task.priority}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                          {task.estimatedTime}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-base text-slate-900">
              Add New Roadmap Milestone
            </h3>

            <form onSubmit={handleAddTask} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Phase
                </label>
                <select
                  value={selectedPhase}
                  onChange={e => setSelectedPhase(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                >
                  {roadmap.phases.map(p => (
                    <option key={p.phaseNumber} value={p.phaseNumber}>
                      Phase {p.phaseNumber}: {p.phaseName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Milestone Task Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Sliding Window & Two Pointers on LeetCode"
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
                >
                  Add Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
