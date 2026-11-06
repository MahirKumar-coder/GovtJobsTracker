import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { SearchBar } from './components/SearchBar';
import { FilterBar } from './components/FilterBar';
import { JobCard } from './components/JobCard';
import { JobDetailModal } from './components/JobDetailModal';
import { ReminderModal } from './components/ReminderModal';
import { AdminJobModal } from './components/AdminJobModal';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { AdBanner } from './components/AdBanner';
import { Footer } from './components/Footer';
import { Job, JobFilter, SummaryStats } from './types/job';
import { getJobsApi, getStatsSummaryApi } from './services/api';
import { Bookmark, RotateCcw } from 'lucide-react';

export const App: React.FC = () => {
  // Navigation / Route state
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname);

  // Admin authentication state (persisted in localStorage)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return !!localStorage.getItem('govjobs_admin_session');
    } catch {
      return false;
    }
  });

  // Jobs & stats state
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<SummaryStats>({
    totalActiveJobs: 0,
    closingSoonJobs: 0,
    totalOpenVacancies: 0,
  });
  const [loading, setLoading] = useState(true);

  // Public Filter state
  const [filters, setFilters] = useState<JobFilter>({
    search: '',
    qualification: 'All',
    category: 'All',
    state: 'All India',
    closingSoonOnly: false,
  });

  // Saved / Bookmarked jobs state
  const [savedJobIds, setSavedJobIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('govjobs_saved_ids');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [showSavedOnly, setShowSavedOnly] = useState(false);

  // Modals state
  const [selectedJobForDetail, setSelectedJobForDetail] = useState<Job | null>(null);
  const [selectedJobForReminder, setSelectedJobForReminder] = useState<Job | null>(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Sync browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Safe navigation function
  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Load jobs and stats
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [jobsData, statsData] = await Promise.all([
          getJobsApi(filters),
          getStatsSummaryApi(),
        ]);
        setJobs(jobsData);
        setStats(statsData);
      } catch (err) {
        console.error('Error loading jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [filters]);

  // Admin login handler
  const handleAdminLoginSuccess = (token: string, _user: { name: string; email: string }) => {
    localStorage.setItem('govjobs_admin_session', token);
    setIsAdminAuthenticated(true);
    navigateTo('/admin');
  };

  // Admin logout handler
  const handleAdminLogout = () => {
    localStorage.removeItem('govjobs_admin_session');
    setIsAdminAuthenticated(false);
    navigateTo('/');
  };

  // Toggle bookmark / saved job
  const handleToggleSave = (job: Job) => {
    setSavedJobIds((prev) => {
      let updated: string[];
      if (prev.includes(job._id)) {
        updated = prev.filter((id) => id !== job._id);
      } else {
        updated = [...prev, job._id];
      }
      localStorage.setItem('govjobs_saved_ids', JSON.stringify(updated));
      return updated;
    });
  };

  const handleUpdateFilters = (updates: Partial<JobFilter>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
    setShowSavedOnly(false);
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      qualification: 'All',
      category: 'All',
      state: 'All India',
      closingSoonOnly: false,
    });
    setShowSavedOnly(false);
  };

  // Add job (works from both Admin modal and dashboard)
  const handleJobAdded = (newJob: Job) => {
    setJobs((prev) => [newJob, ...prev]);
    setStats((prev) => ({
      ...prev,
      totalActiveJobs: prev.totalActiveJobs + 1,
      totalOpenVacancies: prev.totalOpenVacancies + (newJob.vacancies || 0),
    }));
  };

  // Update existing job
  const handleJobUpdated = (updatedJob: Job) => {
    setJobs((prev) => prev.map((j) => (j._id === updatedJob._id ? updatedJob : j)));
  };

  // Delete job
  const handleJobDeleted = (id: string) => {
    setJobs((prev) => prev.filter((j) => j._id !== id));
    setStats((prev) => ({
      ...prev,
      totalActiveJobs: Math.max(0, prev.totalActiveJobs - 1),
    }));
  };

  // -------------------------------------------------------------
  // PROTECTED ROUTE GUARD FOR /admin
  // -------------------------------------------------------------
  if (currentPath === '/admin' || currentPath.startsWith('/admin/')) {
    if (!isAdminAuthenticated) {
      // User is NOT logged in -> STRICTLY SHOW LOGIN GATE (cannot access admin dashboard directly)
      return (
        <AdminLogin
          onLoginSuccess={handleAdminLoginSuccess}
          onBackToHome={() => navigateTo('/')}
        />
      );
    }

    // User is authenticated -> Render full Admin Dashboard
    return (
      <AdminDashboard
        jobs={jobs}
        onJobAdded={handleJobAdded}
        onJobUpdated={handleJobUpdated}
        onJobDeleted={handleJobDeleted}
        onLogout={handleAdminLogout}
        onBackToHome={() => navigateTo('/')}
      />
    );
  }

  // -------------------------------------------------------------
  // PUBLIC PORTAL ROUTE (/)
  // -------------------------------------------------------------
  const displayedJobs = showSavedOnly
    ? jobs.filter((j) => savedJobIds.includes(j._id))
    : jobs;

  const hasActiveFilters =
    filters.qualification !== 'All' ||
    filters.category !== 'All' ||
    filters.state !== 'All India' ||
    filters.closingSoonOnly ||
    filters.search !== '';

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-zinc-950 text-neutral-900 dark:text-zinc-100 transition-colors">
      {/* Top Navigation */}
      <Navbar
        savedCount={savedJobIds.length}
        onOpenSaved={() => setShowSavedOnly((prev) => !prev)}
        onOpenAdmin={() => navigateTo('/admin')}
        isSavedActive={showSavedOnly}
      />

      {/* Hero Header with Live Metrics */}
      <HeroBanner stats={stats} />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full">
        {/* Saved Jobs Header Notification */}
        {showSavedOnly && (
          <div className="mb-4 sm:mb-5 p-3 sm:p-3.5 bg-subtle-theme border border-subtle-theme rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-primary-theme font-medium">
              <Bookmark className="w-4 h-4 fill-current" />
              <span>Showing your saved notices ({displayedJobs.length})</span>
            </div>
            <button
              onClick={() => setShowSavedOnly(false)}
              className="font-semibold text-primary-theme underline hover:opacity-85"
            >
              Show All Notices
            </button>
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="space-y-3 mb-6 sm:mb-7">
          <SearchBar
            value={filters.search}
            onChange={(val) => handleUpdateFilters({ search: val })}
            onClear={() => handleUpdateFilters({ search: '' })}
          />

          <FilterBar
            filters={filters}
            onChange={handleUpdateFilters}
            onReset={handleResetFilters}
          />
        </div>

        {/* Advertisement Banner Container */}
        <AdBanner />

        {/* Section Heading & Result Count */}
        <div className="flex items-center justify-between mb-3.5 sm:mb-4">
          <h2 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-zinc-100 uppercase font-mono tracking-tight">
            {showSavedOnly ? 'Saved Bookmarks' : 'Active Recruitment Notices'}
          </h2>
          <span className="text-[11px] font-mono text-neutral-500 dark:text-zinc-400 bg-neutral-100 dark:bg-zinc-900 px-2 py-0.5 rounded border border-neutral-200 dark:border-zinc-800">
            {displayedJobs.length} {displayedJobs.length === 1 ? 'Notice' : 'Notices'}
          </span>
        </div>

        {/* Job Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4.5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-zinc-900 rounded-xl border border-neutral-200 dark:border-zinc-800 p-4 h-56 animate-pulse space-y-3"
              >
                <div className="h-4 bg-neutral-200 dark:bg-zinc-800 rounded w-1/4" />
                <div className="h-5 bg-neutral-200 dark:bg-zinc-800 rounded w-3/4" />
                <div className="h-9 bg-neutral-100 dark:bg-zinc-800/60 rounded" />
                <div className="h-4 bg-neutral-200 dark:bg-zinc-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : displayedJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4.5">
            {displayedJobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                isSaved={savedJobIds.includes(job._id)}
                onToggleSave={handleToggleSave}
                onOpenDetail={(j) => setSelectedJobForDetail(j)}
                onOpenReminder={(j) => setSelectedJobForReminder(j)}
              />
            ))}
          </div>
        ) : showSavedOnly ? (
          /* Empty state for Saved Jobs */
          <div className="text-center py-12 sm:py-16 px-4 bg-white dark:bg-zinc-900 rounded-2xl border border-neutral-200 dark:border-zinc-800">
            <div className="w-10 h-10 bg-subtle-theme text-primary-theme rounded-xl flex items-center justify-center mx-auto mb-3">
              <Bookmark className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-zinc-100 mb-1">
              No saved notices yet
            </h3>
            <p className="text-xs text-neutral-500 dark:text-zinc-400 max-w-sm mx-auto mb-4 leading-relaxed">
              Click the bookmark icon on any notice to save it for quick reference later.
            </p>
            <button
              onClick={() => setShowSavedOnly(false)}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-primary-theme hover-bg-primary-theme text-xs font-semibold rounded-xl shadow-2xs transition-colors"
            >
              <span>Browse All Notices</span>
            </button>
          </div>
        ) : (
          /* Empty state for Filters / Search */
          <div className="text-center py-12 sm:py-16 px-4 bg-white dark:bg-zinc-900 rounded-2xl border border-neutral-200 dark:border-zinc-800">
            <h3 className="text-base font-bold text-neutral-900 dark:text-zinc-100 mb-1">
              No matching notifications found
            </h3>
            <p className="text-xs text-neutral-500 dark:text-zinc-400 max-w-sm mx-auto mb-4 leading-relaxed">
              No active circular matches your current search or filter combination.
            </p>
            {hasActiveFilters && (
              <div className="flex flex-wrap justify-center gap-1.5 mb-4 max-w-md mx-auto">
                {filters.search && (
                  <span className="text-[11px] font-mono bg-neutral-100 dark:bg-zinc-800 text-neutral-700 dark:text-zinc-300 px-2 py-0.5 rounded border border-neutral-200 dark:border-zinc-700">
                    Query: "{filters.search}"
                  </span>
                )}
                {filters.qualification !== 'All' && (
                  <span className="text-[11px] font-mono bg-neutral-100 dark:bg-zinc-800 text-neutral-700 dark:text-zinc-300 px-2 py-0.5 rounded border border-neutral-200 dark:border-zinc-700">
                    Eligible: {filters.qualification}
                  </span>
                )}
                {filters.category !== 'All' && (
                  <span className="text-[11px] font-mono bg-neutral-100 dark:bg-zinc-800 text-neutral-700 dark:text-zinc-300 px-2 py-0.5 rounded border border-neutral-200 dark:border-zinc-700">
                    Sector: {filters.category}
                  </span>
                )}
                {filters.state !== 'All India' && (
                  <span className="text-[11px] font-mono bg-neutral-100 dark:bg-zinc-800 text-neutral-700 dark:text-zinc-300 px-2 py-0.5 rounded border border-neutral-200 dark:border-zinc-700">
                    Region: {filters.state}
                  </span>
                )}
                {filters.closingSoonOnly && (
                  <span className="text-[11px] font-mono bg-amber-500/10 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded border border-amber-500/30">
                    &le; 7 Days
                  </span>
                )}
              </div>
            )}
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-primary-theme hover-bg-primary-theme text-xs font-semibold rounded-xl shadow-2xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <JobDetailModal
        job={selectedJobForDetail}
        onClose={() => setSelectedJobForDetail(null)}
      />

      <ReminderModal
        job={selectedJobForReminder}
        onClose={() => setSelectedJobForReminder(null)}
      />

      <AdminJobModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onJobAdded={handleJobAdded}
      />
    </div>
  );
};

export default App;
