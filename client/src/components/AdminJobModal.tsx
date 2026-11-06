import React, { useState } from 'react';
import { X, Plus, CheckCircle2 } from 'lucide-react';
import { Job } from '../types/job';

interface AdminJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobAdded: (job: Job) => void;
}

export const AdminJobModal: React.FC<AdminJobModalProps> = ({ isOpen, onClose, onJobAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    vacancies: '',
    category: 'SSC',
    state: 'All India',
    qualification: 'Graduate',
    startDate: new Date().toISOString().split('T')[0],
    lastDate: '',
    examDate: '',
    feesGen: '100',
    feesScSt: '0',
    ageMin: '18',
    ageMax: '30',
    officialWebsite: '',
    applyLink: '',
    shortDescription: '',
  });

  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newJob: Job = {
      _id: `custom-${Date.now()}`,
      title: formData.title,
      department: formData.department,
      vacancies: parseInt(formData.vacancies) || 0,
      category: formData.category,
      state: formData.state,
      qualification: [formData.qualification],
      startDate: formData.startDate,
      lastDate: formData.lastDate,
      examDate: formData.examDate,
      fees: {
        generalOBC: parseInt(formData.feesGen) || 0,
        scST: parseInt(formData.feesScSt) || 0,
      },
      ageLimit: {
        min: parseInt(formData.ageMin) || 18,
        max: parseInt(formData.ageMax) || 30,
      },
      officialWebsite: formData.officialWebsite || 'https://gov.in',
      applyLink: formData.applyLink || formData.officialWebsite || 'https://gov.in',
      shortDescription: formData.shortDescription,
      status: 'Active',
      isFeatured: false,
      views: 1,
      createdAt: new Date().toISOString(),
    };

    onJobAdded(newJob);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-zinc-900 text-neutral-900 dark:text-zinc-100 rounded-2xl max-w-xl w-full p-4 sm:p-6 shadow-2xl border border-neutral-200 dark:border-zinc-800 max-h-[92vh] overflow-y-auto transition-colors">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-zinc-800 mb-3.5">
          <div className="flex items-center space-x-2">
            <Plus className="w-4 h-4 text-primary-theme" />
            <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-zinc-100">
              Publish Official Notice
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:text-zinc-500 dark:hover:text-zinc-200 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h4 className="font-bold text-base text-neutral-900 dark:text-zinc-100">
              Notice Published Successfully
            </h4>
            <p className="text-xs text-neutral-500 dark:text-zinc-400">
              The vacancy is now live on the portal.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-medium text-neutral-700 dark:text-zinc-300 mb-1">
                Notification / Post Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. SSC CGL 2026 Examination"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100 ring-primary-theme"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block font-medium text-neutral-700 dark:text-zinc-300 mb-1">
                  Department / Board *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Staff Selection Commission"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100 ring-primary-theme"
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-700 dark:text-zinc-300 mb-1">
                  Total Vacancies *
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 5000"
                  value={formData.vacancies}
                  onChange={(e) => setFormData({ ...formData, vacancies: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100 ring-primary-theme"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block font-medium text-neutral-700 dark:text-zinc-300 mb-1">Sector</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-2 py-1.5 rounded-lg border border-neutral-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100"
                >
                  <option value="SSC">SSC</option>
                  <option value="Railway">Railway</option>
                  <option value="Banking">Banking</option>
                  <option value="Police">Police</option>
                  <option value="Teaching">Teaching</option>
                  <option value="Defence">Defence</option>
                  <option value="State PSC">State PSC</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 dark:text-zinc-300 mb-1">Location</label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-2 py-1.5 rounded-lg border border-neutral-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100"
                >
                  <option value="All India">All India</option>
                  <option value="Bihar">Bihar</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 dark:text-zinc-300 mb-1">Eligibility</label>
                <select
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  className="w-full px-2 py-1.5 rounded-lg border border-neutral-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100"
                >
                  <option value="10th">10th Pass</option>
                  <option value="12th">12th Pass</option>
                  <option value="Graduate">Graduate</option>
                  <option value="Diploma">Diploma</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block font-medium text-neutral-700 dark:text-zinc-300 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-700 dark:text-zinc-300 mb-1">
                  Last Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.lastDate}
                  onChange={(e) => setFormData({ ...formData, lastDate: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block font-medium text-neutral-700 dark:text-zinc-300 mb-1">
                  Fee (Gen/OBC) in ₹
                </label>
                <input
                  type="number"
                  value={formData.feesGen}
                  onChange={(e) => setFormData({ ...formData, feesGen: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100"
                />
              </div>
              <div>
                <label className="block font-medium text-neutral-700 dark:text-zinc-300 mb-1">
                  Fee (SC/ST) in ₹
                </label>
                <input
                  type="number"
                  value={formData.feesScSt}
                  onChange={(e) => setFormData({ ...formData, feesScSt: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-neutral-700 dark:text-zinc-300 mb-1">
                Official Apply Link *
              </label>
              <input
                type="url"
                required
                placeholder="https://..."
                value={formData.applyLink}
                onChange={(e) => setFormData({ ...formData, applyLink: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100 ring-primary-theme"
              />
            </div>

            <div>
              <label className="block font-medium text-neutral-700 dark:text-zinc-300 mb-1">
                Notice Summary *
              </label>
              <textarea
                rows={2}
                required
                placeholder="Summary of post criteria and key requirements..."
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100 ring-primary-theme"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-neutral-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 text-neutral-600 dark:text-zinc-400 hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-primary-theme hover-bg-primary-theme font-semibold rounded-lg shadow-2xs"
              >
                Publish Notice
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
