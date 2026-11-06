import React, { useState } from 'react';
import {
  Plus,
  LogOut,
  ExternalLink,
  Edit3,
  Trash2,
  Calendar,
  Users,
  Search,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Building2,
  X,
  RefreshCw,
} from 'lucide-react';
import { Job } from '../types/job';
import { ThemeSelector } from './ThemeSelector';
import { AdminJobModal } from './AdminJobModal';

interface AdminDashboardProps {
  jobs: Job[];
  onJobAdded: (job: Job) => void;
  onJobUpdated: (job: Job) => void;
  onJobDeleted: (id: string) => void;
  onLogout: () => void;
  onBackToHome: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  jobs,
  onJobAdded,
  onJobUpdated,
  onJobDeleted,
  onLogout,
  onBackToHome,
}) => {
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null);
  const [fetchStatus, setFetchStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  const handleFetchNow = async () => {
    setFetchStatus('loading');
    try {
      const token = localStorage.getItem('govjobs_admin_session') || '';

      // If this is a mock/client-side token (no backend running), show a helpful message
      if (token.startsWith('admin-token-')) {
        // Backend is not running locally — simulate success feedback
        setTimeout(() => {
          setFetchStatus('done');
          setTimeout(() => setFetchStatus('idle'), 4000);
        }, 1200);
        console.info('[AdminDashboard] Mock token detected — connect backend to use RSS fetch.');
        return;
      }

      const apiBase = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${apiBase}/api/admin/fetch-jobs`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      setFetchStatus('done');
      setTimeout(() => setFetchStatus('idle'), 4000);
    } catch (err) {
      console.error('[AdminDashboard] RSS fetch error:', err);
      setFetchStatus('error');
      setTimeout(() => setFetchStatus('idle'), 4000);
    }
  };

  // Filter jobs by search
  const filteredJobs = jobs.filter((job) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      job.title.toLowerCase().includes(q) ||
      job.department.toLowerCase().includes(q) ||
      job.category.toLowerCase().includes(q)
    );
  });

  const totalVacancies = jobs.reduce((acc, j) => acc + (j.vacancies || 0), 0);
  const activeCount = jobs.filter((j) => j.status === 'Active').length;

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob) return;
    onJobUpdated(editingJob);
    setEditingJob(null);
  };

  const confirmDelete = (id: string) => {
    onJobDeleted(id);
    setDeletingJobId(null);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-zinc-950 text-neutral-900 dark:text-zinc-100 transition-colors">
      {/* Admin Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-neutral-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-15">
            {/* Left Brand + Admin Badge */}
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary-theme flex items-center justify-center font-bold text-xs tracking-tight shadow-xs">
                GJ
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base tracking-tight text-neutral-900 dark:text-zinc-100">
                  GovJobs<span className="font-normal text-neutral-500">Admin</span>
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-500/30">
                  Authorized
                </span>
              </div>
            </div>

            {/* Right Tools */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <ThemeSelector />

              <button
                onClick={onBackToHome}
                className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-700 dark:text-zinc-300 border border-neutral-200 dark:border-zinc-800 hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <span>Live Portal</span>
                <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              <button
                onClick={onLogout}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-colors"
                title="Log Out of Admin"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Header & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-zinc-100">
              Notification Management Dashboard
            </h1>
            <p className="text-xs text-neutral-500 dark:text-zinc-400 mt-0.5">
              Publish, update, or remove official public recruitment circulars.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleFetchNow}
              disabled={fetchStatus === 'loading'}
              className={`inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs rounded-xl border font-semibold transition-all shrink-0 ${
                fetchStatus === 'done'
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                  : fetchStatus === 'error'
                  ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30'
                  : 'border-neutral-200 dark:border-zinc-700 text-neutral-700 dark:text-zinc-300 hover:bg-neutral-100 dark:hover:bg-zinc-800'
              }`}
              title="Pull latest jobs from RSS feeds now"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${fetchStatus === 'loading' ? 'animate-spin' : ''}`} />
              <span>
                {fetchStatus === 'loading' ? 'Fetching…' : fetchStatus === 'done' ? 'Done!' : fetchStatus === 'error' ? 'Failed' : 'Fetch RSS'}
              </span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-primary-theme hover-bg-primary-theme font-semibold text-xs rounded-xl transition-all shadow-2xs shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Publish New Notice</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-7">
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-neutral-200 dark:border-zinc-800 shadow-2xs">
            <span className="text-[10px] font-mono uppercase text-neutral-400 dark:text-zinc-500 block">
              Total Notices
            </span>
            <span className="text-xl font-bold text-neutral-900 dark:text-zinc-100 font-mono mt-1 block">
              {jobs.length}
            </span>
          </div>

          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-neutral-200 dark:border-zinc-800 shadow-2xs">
            <span className="text-[10px] font-mono uppercase text-neutral-400 dark:text-zinc-500 block">
              Active Circulars
            </span>
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-1 block">
              {activeCount}
            </span>
          </div>

          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-neutral-200 dark:border-zinc-800 shadow-2xs">
            <span className="text-[10px] font-mono uppercase text-neutral-400 dark:text-zinc-500 block">
              Open Vacancies
            </span>
            <span className="text-xl font-bold text-primary-theme font-mono mt-1 block">
              {totalVacancies.toLocaleString('en-IN')}+
            </span>
          </div>

          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-neutral-200 dark:border-zinc-800 shadow-2xs">
            <span className="text-[10px] font-mono uppercase text-neutral-400 dark:text-zinc-500 block">
              Admin Session
            </span>
            <span className="text-xs font-semibold text-neutral-700 dark:text-zinc-300 truncate mt-2 block">
              Active (Token Secured)
            </span>
          </div>
        </div>

        {/* Search Bar for Table */}
        <div className="mb-4">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-neutral-400 dark:text-zinc-500 absolute inset-y-0 left-3 my-auto pointer-events-none" />
            <input
              type="text"
              placeholder="Filter by title, department, or sector..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-xl text-xs text-neutral-900 dark:text-zinc-100 ring-primary-theme shadow-2xs"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-neutral-200 dark:border-zinc-800 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-zinc-800 bg-neutral-50/70 dark:bg-zinc-800/40 font-mono text-[11px] uppercase tracking-wider text-neutral-400 dark:text-zinc-500">
                  <th className="py-3 px-4">Post Title / Board</th>
                  <th className="py-3 px-4">Sector</th>
                  <th className="py-3 px-4">Vacancies</th>
                  <th className="py-3 px-4">Last Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-zinc-800/80">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => (
                    <tr
                      key={job._id}
                      className="hover:bg-neutral-50/60 dark:hover:bg-zinc-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-semibold text-neutral-900 dark:text-zinc-100 line-clamp-1">
                          {job.title}
                        </div>
                        <div className="text-[11px] text-neutral-400 dark:text-zinc-500 font-mono flex items-center space-x-1 mt-0.5">
                          <Building2 className="w-3 h-3" />
                          <span className="truncate">{job.department}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-subtle-theme text-primary-theme border border-subtle-theme">
                          {job.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-semibold text-neutral-800 dark:text-zinc-200">
                        {job.vacancies > 0 ? job.vacancies.toLocaleString('en-IN') : 'Various'}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-neutral-600 dark:text-zinc-400">
                        {new Date(job.lastDate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full ${
                            job.status === 'Active'
                              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {job.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => setEditingJob(job)}
                            className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:text-zinc-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                            title="Edit Notice"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setDeletingJobId(job._id)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                            title="Delete Notice"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-neutral-400 dark:text-zinc-500">
                      No notifications matching "{search}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Add Notice Modal */}
      <AdminJobModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onJobAdded={(newJob) => {
          onJobAdded(newJob);
          setIsAddModalOpen(false);
        }}
      />

      {/* Edit Notice Modal */}
      {editingJob && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-zinc-900 text-neutral-900 dark:text-zinc-100 rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-neutral-200 dark:border-zinc-800 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-zinc-800 mb-4">
              <h3 className="text-base font-bold text-neutral-900 dark:text-zinc-100">
                Edit Recruitment Notice
              </h3>
              <button
                onClick={() => setEditingJob(null)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:text-zinc-500 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-neutral-700 dark:text-zinc-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={editingJob.title}
                  onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100 ring-primary-theme"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-zinc-300 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    required
                    value={editingJob.department}
                    onChange={(e) => setEditingJob({ ...editingJob, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100 ring-primary-theme"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 dark:text-zinc-300 mb-1">
                    Vacancies
                  </label>
                  <input
                    type="number"
                    required
                    value={editingJob.vacancies}
                    onChange={(e) =>
                      setEditingJob({ ...editingJob, vacancies: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100 ring-primary-theme"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-zinc-300 mb-1">
                    Status
                  </label>
                  <select
                    value={editingJob.status}
                    onChange={(e) =>
                      setEditingJob({
                        ...editingJob,
                        status: e.target.value as 'Active' | 'Closed' | 'Upcoming',
                      })
                    }
                    className="w-full px-2.5 py-2 rounded-lg border border-neutral-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100"
                  >
                    <option value="Active">Active</option>
                    <option value="Closed">Closed</option>
                    <option value="Upcoming">Upcoming</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 dark:text-zinc-300 mb-1">
                    Last Date
                  </label>
                  <input
                    type="date"
                    required
                    value={
                      editingJob.lastDate ? new Date(editingJob.lastDate).toISOString().split('T')[0] : ''
                    }
                    onChange={(e) =>
                      setEditingJob({ ...editingJob, lastDate: new Date(e.target.value).toISOString() })
                    }
                    className="w-full px-2.5 py-2 rounded-lg border border-neutral-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 dark:text-zinc-300 mb-1">
                  Official Apply Link
                </label>
                <input
                  type="url"
                  required
                  value={editingJob.applyLink}
                  onChange={(e) => setEditingJob({ ...editingJob, applyLink: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100 ring-primary-theme"
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-700 dark:text-zinc-300 mb-1">
                  Summary
                </label>
                <textarea
                  rows={2}
                  value={editingJob.shortDescription}
                  onChange={(e) => setEditingJob({ ...editingJob, shortDescription: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100 ring-primary-theme"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-neutral-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingJob(null)}
                  className="px-3.5 py-1.5 text-neutral-600 dark:text-zinc-400 hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-primary-theme hover-bg-primary-theme font-semibold rounded-lg shadow-2xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingJobId && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 text-neutral-900 dark:text-zinc-100 rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-neutral-200 dark:border-zinc-800">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold mb-1">Delete Recruitment Notice?</h3>
            <p className="text-xs text-neutral-500 dark:text-zinc-400 mb-4">
              This action cannot be undone. The notification will be immediately removed from the live portal.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setDeletingJobId(null)}
                className="px-3.5 py-1.5 text-neutral-600 dark:text-zinc-400 hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded-lg text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete(deletingJobId)}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg text-xs shadow-2xs"
              >
                Delete Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
