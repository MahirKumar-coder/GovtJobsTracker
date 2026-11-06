import React, { useState } from 'react';
import {
  X,
  Calendar,
  CreditCard,
  UserCheck,
  FileText,
  ArrowUpRight,
  Bell,
  Check,
  Building2,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { Job } from '../types/job';
import { subscribeEmailApi } from '../services/api';

interface JobDetailModalProps {
  job: Job | null;
  onClose: () => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({ job, onClose }) => {
  const [reminderEmail, setReminderEmail] = useState('');
  const [reminderStatus, setReminderStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!job) return null;

  const handleReminderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderEmail) return;

    setIsSubmitting(true);
    const res = await subscribeEmailApi(reminderEmail, job._id);
    setReminderStatus(res.message);
    setIsSubmitting(false);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-zinc-900 text-neutral-900 dark:text-zinc-100 rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-neutral-200 dark:border-zinc-800 flex flex-col transition-colors">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-4 sm:px-6 py-3.5 sm:py-4 border-b border-neutral-200 dark:border-zinc-800 flex items-start justify-between z-10">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-subtle-theme text-primary-theme border border-subtle-theme">
                {job.category}
              </span>
              <span className="flex items-center space-x-1 text-xs text-neutral-500 dark:text-zinc-400">
                <MapPin className="w-3 h-3" />
                <span>{job.state}</span>
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold tracking-tight">{job.title}</h2>
            <p className="text-[11px] sm:text-xs text-neutral-500 dark:text-zinc-400 flex items-center space-x-1 mt-0.5 font-mono">
              <Building2 className="w-3.5 h-3.5" />
              <span>{job.department}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:text-zinc-500 dark:hover:text-zinc-200 hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded-lg transition-colors shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-5 text-xs text-neutral-700 dark:text-zinc-300">
          {/* Key Summary Bar */}
          <div className="p-3 bg-neutral-50 dark:bg-zinc-800/60 border border-neutral-200 dark:border-zinc-800 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-mono text-neutral-400 dark:text-zinc-500 block">
                Total Available Vacancies
              </span>
              <span className="text-lg sm:text-xl font-bold text-primary-theme font-mono">
                {job.vacancies > 0 ? `${job.vacancies.toLocaleString('en-IN')} Posts` : 'Multiple Positions'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-mono text-neutral-400 dark:text-zinc-500 block">
                Status
              </span>
              <span className="inline-block mt-0.5 px-2 py-0.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold rounded text-[11px] font-mono">
                {job.status}
              </span>
            </div>
          </div>

          {/* Important Dates */}
          <div>
            <h4 className="font-semibold text-neutral-900 dark:text-zinc-100 text-xs uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-neutral-500" />
              <span>Timeline</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="p-2.5 bg-neutral-50 dark:bg-zinc-800/50 rounded-xl border border-neutral-200 dark:border-zinc-800">
                <span className="text-[10px] uppercase font-mono text-neutral-400 dark:text-zinc-500 block">Start Date</span>
                <span className="font-semibold text-neutral-800 dark:text-zinc-200">{formatDate(job.startDate)}</span>
              </div>
              <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/30">
                <span className="text-[10px] uppercase font-mono text-amber-700 dark:text-amber-400 block font-semibold">Application Deadline</span>
                <span className="font-bold text-amber-900 dark:text-amber-200">{formatDate(job.lastDate)}</span>
              </div>
              <div className="p-2.5 bg-neutral-50 dark:bg-zinc-800/50 rounded-xl border border-neutral-200 dark:border-zinc-800">
                <span className="text-[10px] uppercase font-mono text-neutral-400 dark:text-zinc-500 block">Exam Date</span>
                <span className="font-semibold text-neutral-800 dark:text-zinc-200">{job.examDate || 'To be announced'}</span>
              </div>
            </div>
          </div>

          {/* Application Fee */}
          <div>
            <h4 className="font-semibold text-neutral-900 dark:text-zinc-100 text-xs uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <CreditCard className="w-3.5 h-3.5 text-neutral-500" />
              <span>Fee Structure</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="p-2.5 bg-neutral-50 dark:bg-zinc-800/50 rounded-xl border border-neutral-200 dark:border-zinc-800">
                <span className="text-[10px] uppercase font-mono text-neutral-400 dark:text-zinc-500 block">General / OBC / EWS</span>
                <span className="font-semibold text-neutral-800 dark:text-zinc-200">
                  {job.fees.generalOBC === 0 ? 'Exempted (₹0)' : `₹${job.fees.generalOBC}`}
                </span>
              </div>
              <div className="p-2.5 bg-neutral-50 dark:bg-zinc-800/50 rounded-xl border border-neutral-200 dark:border-zinc-800">
                <span className="text-[10px] uppercase font-mono text-neutral-400 dark:text-zinc-500 block">SC / ST / PwD</span>
                <span className="font-semibold text-neutral-800 dark:text-zinc-200">
                  {job.fees.scST === 0 ? 'Exempted (₹0)' : `₹${job.fees.scST}`}
                </span>
              </div>
              <div className="p-2.5 bg-neutral-50 dark:bg-zinc-800/50 rounded-xl border border-neutral-200 dark:border-zinc-800">
                <span className="text-[10px] uppercase font-mono text-neutral-400 dark:text-zinc-500 block">Female Applicants</span>
                <span className="font-semibold text-neutral-800 dark:text-zinc-200">
                  {job.fees.female === 0 ? 'Exempted (₹0)' : `₹${job.fees.female ?? job.fees.generalOBC}`}
                </span>
              </div>
            </div>
            {job.fees.details && (
              <p className="text-[11px] text-neutral-500 dark:text-zinc-400 mt-1 italic">
                * Note: {job.fees.details}
              </p>
            )}
          </div>

          {/* Eligibility & Age Criteria */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-3 bg-neutral-50 dark:bg-zinc-800/50 rounded-xl border border-neutral-200 dark:border-zinc-800">
              <h4 className="font-semibold text-neutral-900 dark:text-zinc-100 text-xs uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
                <UserCheck className="w-3.5 h-3.5 text-neutral-500" />
                <span>Eligibility</span>
              </h4>
              <div className="flex flex-wrap gap-1 mb-1.5">
                {job.qualification.map((q) => (
                  <span
                    key={q}
                    className="px-2 py-0.5 bg-white dark:bg-zinc-700 border border-neutral-200 dark:border-zinc-600 rounded text-[11px] font-semibold text-neutral-800 dark:text-zinc-200"
                  >
                    {q}
                  </span>
                ))}
              </div>
              <p className="text-xs text-neutral-600 dark:text-zinc-400 leading-relaxed">
                {job.shortDescription}
              </p>
            </div>

            <div className="p-3 bg-neutral-50 dark:bg-zinc-800/50 rounded-xl border border-neutral-200 dark:border-zinc-800">
              <h4 className="font-semibold text-neutral-900 dark:text-zinc-100 text-xs uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                <span>Age Limit</span>
              </h4>
              <p className="text-sm sm:text-base font-bold text-neutral-900 dark:text-zinc-100 mb-0.5 font-mono">
                {job.ageLimit.min} to {job.ageLimit.max} Years
              </p>
              <p className="text-[11px] text-neutral-500 dark:text-zinc-400">
                {job.ageLimit.relaxationDetails || 'Standard government category age relaxation applicable.'}
              </p>
            </div>
          </div>

          {/* Selection Procedure */}
          {job.selectionProcess && job.selectionProcess.length > 0 && (
            <div>
              <h4 className="font-semibold text-neutral-900 dark:text-zinc-100 text-xs uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Selection Procedure</span>
              </h4>
              <div className="space-y-1">
                {job.selectionProcess.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-center space-x-2 text-xs text-neutral-700 dark:text-zinc-300"
                  >
                    <span className="w-4 h-4 rounded-full bg-neutral-200 dark:bg-zinc-700 text-neutral-800 dark:text-zinc-200 font-bold flex items-center justify-center text-[10px] shrink-0 font-mono">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Email Reminder Box */}
          <div className="p-3 bg-neutral-100 dark:bg-zinc-800/80 rounded-xl border border-neutral-200 dark:border-zinc-700">
            <div className="flex items-center space-x-1.5 mb-1">
              <Bell className="w-3.5 h-3.5 text-primary-theme" />
              <h4 className="font-semibold text-neutral-900 dark:text-zinc-100 text-xs">
                Email Deadline Reminder
              </h4>
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-zinc-400 mb-2">
              Receive an email alert 3 days prior to application deadline.
            </p>
            {reminderStatus ? (
              <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium flex items-center space-x-1">
                <Check className="w-3.5 h-3.5" />
                <span>{reminderStatus}</span>
              </p>
            ) : (
              <form onSubmit={handleReminderSubmit} className="flex flex-col sm:flex-row gap-1.5">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={reminderEmail}
                  onChange={(e) => setReminderEmail(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-neutral-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-neutral-900 dark:text-zinc-100 focus:outline-none ring-primary-theme"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-3.5 py-1.5 bg-primary-theme hover-bg-primary-theme font-semibold text-xs rounded-lg transition-colors shrink-0 shadow-2xs"
                >
                  {isSubmitting ? 'Saving...' : 'Set Reminder'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 bg-neutral-50 dark:bg-zinc-950 px-4 sm:px-6 py-3 border-t border-neutral-200 dark:border-zinc-800 flex items-center justify-between gap-2">
          {job.officialNotificationPdf ? (
            <a
              href={job.officialNotificationPdf}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-neutral-600 dark:text-zinc-400 hover:text-neutral-900 dark:hover:text-zinc-100 flex items-center space-x-1 underline truncate"
            >
              <FileText className="w-3.5 h-3.5 shrink-0" />
              <span>Official PDF</span>
            </a>
          ) : <div />}

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-zinc-700 text-neutral-700 dark:text-zinc-300 font-semibold text-xs hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Close
            </button>
            <a
              href={job.applyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-1.5 rounded-lg bg-primary-theme hover-bg-primary-theme font-semibold text-xs inline-flex items-center space-x-1 transition-colors shadow-2xs"
            >
              <span>Apply Online</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
