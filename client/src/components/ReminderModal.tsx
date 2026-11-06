import React, { useState } from 'react';
import { X, Bell, CheckCircle2 } from 'lucide-react';
import { Job } from '../types/job';
import { subscribeEmailApi } from '../services/api';

interface ReminderModalProps {
  job: Job | null;
  onClose: () => void;
}

export const ReminderModal: React.FC<ReminderModalProps> = ({ job, onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!job) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    const res = await subscribeEmailApi(email, job._id);
    setMessage(res.message);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-zinc-900 text-neutral-900 dark:text-zinc-100 rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-neutral-200 dark:border-zinc-800 relative transition-colors">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-neutral-700 dark:text-zinc-500 dark:hover:text-zinc-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-9 h-9 rounded-xl bg-subtle-theme text-primary-theme flex items-center justify-center mb-3">
          <Bell className="w-4 h-4" />
        </div>

        <h3 className="text-base font-bold text-neutral-900 dark:text-zinc-100 mb-1">
          Last Date Email Reminder
        </h3>
        <p className="text-xs text-neutral-600 dark:text-zinc-400 mb-4 line-clamp-2">
          Notice: <strong className="text-neutral-900 dark:text-zinc-200">{job.title}</strong>
        </p>

        {message ? (
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Reminder Confirmed</p>
              <p className="mt-0.5">{message}</p>
              <button
                onClick={onClose}
                className="mt-2.5 px-3 py-1 bg-primary-theme text-xs font-semibold rounded-lg"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-medium text-neutral-700 dark:text-zinc-300 mb-1">
                Your Email Address
              </label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100 text-xs ring-primary-theme"
              />
              <p className="text-[11px] text-neutral-400 dark:text-zinc-500 mt-1">
                We'll email you 3 days before deadline ({new Date(job.lastDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}). Zero spam.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-neutral-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 font-medium text-neutral-600 dark:text-zinc-400 hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-1.5 font-semibold bg-primary-theme hover-bg-primary-theme rounded-lg shadow-2xs transition-colors"
              >
                {loading ? 'Activating...' : 'Activate Reminder'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
