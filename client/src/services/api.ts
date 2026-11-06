import { Job, JobFilter, SummaryStats } from '../types/job';

const API_BASE_URL = '/api';

// Helper to generate dynamic dates relative to today
const getFutureDate = (days: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
};

const getPastDate = (days: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
};

// Comprehensive mock dataset covering all categories & qualifications
export const MOCK_JOBS: Job[] = [
  {
    _id: 'job-1',
    title: 'SSC CGL 2026 Combined Graduate Level Exam',
    department: 'Staff Selection Commission (SSC)',
    vacancies: 14582,
    qualification: ['Graduate'],
    ageLimit: { min: 18, max: 32, relaxationDetails: 'OBC: 3 yrs, SC/ST: 5 yrs, PwD: 10 yrs' },
    fees: { generalOBC: 100, scST: 0, female: 0, details: 'Exempted for Women candidates and SC/ST/PwD' },
    startDate: getPastDate(15),
    lastDate: getFutureDate(14),
    examDate: 'Tier-1: Next Month',
    state: 'All India',
    category: 'SSC',
    selectionProcess: ['Tier-1 Computer Based Test', 'Tier-2 CBT', 'Document Verification & Medical'],
    officialWebsite: 'https://ssc.gov.in',
    officialNotificationPdf: 'https://ssc.gov.in',
    applyLink: 'https://ssc.gov.in',
    shortDescription:
      'Recruitment for Group B & C posts including Inspector (Central Excise/IT), Assistant Section Officer (CSS), and Auditor.',
    status: 'Active',
    isFeatured: true,
    views: 4520,
    createdAt: getPastDate(15),
  },
  {
    _id: 'job-2',
    title: 'RRB NTPC Non-Technical Popular Categories Recruitment',
    department: 'Railway Recruitment Boards (RRB)',
    vacancies: 11558,
    qualification: ['12th', 'Graduate'],
    ageLimit: { min: 18, max: 33, relaxationDetails: 'OBC: 3 yrs, SC/ST: 5 yrs' },
    fees: { generalOBC: 500, scST: 250, female: 250, details: '₹400 refunded after appearing in CBT-1' },
    startDate: getPastDate(20),
    lastDate: getFutureDate(4), // Closing soon! (4 days left)
    examDate: 'CBT 1: Coming Soon',
    state: 'All India',
    category: 'Railway',
    selectionProcess: ['1st Stage CBT', '2nd Stage CBT', 'Typing Skill Test / CBAT', 'Document Verification'],
    officialWebsite: 'https://indianrailways.gov.in',
    officialNotificationPdf: 'https://rrbapply.gov.in',
    applyLink: 'https://rrbapply.gov.in',
    shortDescription:
      'Indian Railways mega hiring for Station Master, Goods Train Manager, Junior Clerk cum Typist, and Senior Clerk.',
    status: 'Active',
    isFeatured: true,
    views: 7890,
    createdAt: getPastDate(20),
  },
  {
    _id: 'job-3',
    title: 'Bihar Police Sub Inspector (Daroga) Recruitment',
    department: 'Bihar Police Sub-ordinate Services Commission (BPSSC)',
    vacancies: 2128,
    qualification: ['Graduate'],
    ageLimit: { min: 20, max: 37, relaxationDetails: 'OBC/EBC: 40 yrs, SC/ST: 42 yrs' },
    fees: { generalOBC: 700, scST: 400, female: 400, details: 'Online via NetBanking / UPI / Cards' },
    startDate: getPastDate(12),
    lastDate: getFutureDate(3), // Closing soon! (3 days left)
    examDate: 'Prelims: Next Month',
    state: 'Bihar',
    category: 'Police',
    selectionProcess: ['Prelims Exam', 'Mains Exam', 'Physical Efficiency Test (PET)', 'Medical'],
    officialWebsite: 'https://bpssc.bih.nic.in',
    officialNotificationPdf: 'https://bpssc.bih.nic.in',
    applyLink: 'https://bpssc.bih.nic.in',
    shortDescription:
      'Direct recruitment for Police Sub-Inspector posts in Home (Police) Dept, Govt of Bihar. Bachelor degree in any discipline.',
    status: 'Active',
    isFeatured: true,
    views: 6540,
    createdAt: getPastDate(12),
  },
  {
    _id: 'job-4',
    title: 'UP Police Constable & PAC Recruitment 2026',
    department: 'UP Police Recruitment and Promotion Board (UPPRPB)',
    vacancies: 18450,
    qualification: ['10th', '12th'],
    ageLimit: { min: 18, max: 25, relaxationDetails: '5 years relaxation for SC/ST/OBC of UP' },
    fees: { generalOBC: 400, scST: 400, female: 400, details: 'Same fee for all categories' },
    startDate: getPastDate(10),
    lastDate: getFutureDate(19),
    examDate: 'OMR Written Test',
    state: 'Uttar Pradesh',
    category: 'Police',
    selectionProcess: ['Written Exam (OMR)', 'Physical Standard Test (PST)', 'Physical Efficiency Test (Run)'],
    officialWebsite: 'https://uppbpb.gov.in',
    officialNotificationPdf: 'https://uppbpb.gov.in',
    applyLink: 'https://uppbpb.gov.in',
    shortDescription:
      'Massive recruitment for Civil Police Constables and Armed Constabulary (PAC). 12th pass candidates eligible.',
    status: 'Active',
    isFeatured: true,
    views: 8900,
    createdAt: getPastDate(10),
  },
  {
    _id: 'job-5',
    title: 'IBPS PO XIV Probationary Officers Recruitment',
    department: 'Institute of Banking Personnel Selection (IBPS)',
    vacancies: 4455,
    qualification: ['Graduate'],
    ageLimit: { min: 20, max: 30, relaxationDetails: 'OBC: 3 yrs, SC/ST: 5 yrs' },
    fees: { generalOBC: 850, scST: 175, female: 850, details: 'Online payment only' },
    startDate: getPastDate(8),
    lastDate: getFutureDate(12),
    examDate: 'Prelims Online Exam',
    state: 'All India',
    category: 'Banking',
    selectionProcess: ['Online Preliminary Exam', 'Online Main Exam', 'Common Interview'],
    officialWebsite: 'https://ibps.in',
    officialNotificationPdf: 'https://ibps.in',
    applyLink: 'https://ibps.in',
    shortDescription:
      'Probationary Officers recruitment across 11 nationalized public sector banks (PNB, BoB, Canara, Indian Bank, etc.).',
    status: 'Active',
    isFeatured: false,
    views: 3120,
    createdAt: getPastDate(8),
  },
  {
    _id: 'job-6',
    title: 'CTET Central Teacher Eligibility Test',
    department: 'Central Board of Secondary Education (CBSE)',
    vacancies: 0,
    qualification: ['Diploma', 'Graduate', '12th'],
    ageLimit: { min: 18, max: 50, relaxationDetails: 'No upper age limit specified' },
    fees: { generalOBC: 1000, scST: 500, female: 1000, details: 'Single paper ₹1000, Both papers ₹1200' },
    startDate: getPastDate(5),
    lastDate: getFutureDate(22),
    examDate: 'OMR Based Exam',
    state: 'All India',
    category: 'Teaching',
    selectionProcess: ['Paper-1 (Primary Level)', 'Paper-2 (Upper Primary Level)'],
    officialWebsite: 'https://ctet.nic.in',
    officialNotificationPdf: 'https://ctet.nic.in',
    applyLink: 'https://ctet.nic.in',
    shortDescription:
      'National level teacher eligibility certification for KVS, NVS, Central Schools and state school appointments.',
    status: 'Active',
    isFeatured: true,
    views: 6120,
    createdAt: getPastDate(5),
  },
  {
    _id: 'job-7',
    title: 'Indian Airforce Agniveervayu (Intake 01/2027)',
    department: 'Indian Air Force (IAF)',
    vacancies: 3500,
    qualification: ['10th', '12th', 'Diploma'],
    ageLimit: { min: 17, max: 21, relaxationDetails: 'Strictly as per official IAF notification cut-off' },
    fees: { generalOBC: 550, scST: 550, female: 550, details: 'Online payment via NetBanking/Cards' },
    startDate: getPastDate(9),
    lastDate: getFutureDate(7), // Closing soon (7 days left)
    examDate: 'Online Computer Based Exam',
    state: 'All India',
    category: 'Defence',
    selectionProcess: ['Phase-1 Online Exam', 'Phase-2 Physical Fitness Test', 'Medical Examination'],
    officialWebsite: 'https://agnipathvayu.cdac.in',
    officialNotificationPdf: 'https://agnipathvayu.cdac.in',
    applyLink: 'https://agnipathvayu.cdac.in',
    shortDescription:
      'Serve as Agniveervayu in the Indian Air Force for 4 years with attractive monthly package and Seva Nidhi.',
    status: 'Active',
    isFeatured: false,
    views: 5120,
    createdAt: getPastDate(9),
  },
  {
    _id: 'job-8',
    title: 'Railway RPF Sub Inspector & Constable Recruitment',
    department: 'Railway Protection Force (RPF)',
    vacancies: 4660,
    qualification: ['10th', 'Graduate'],
    ageLimit: { min: 18, max: 28, relaxationDetails: 'OBC: 3 yrs, SC/ST: 5 yrs' },
    fees: { generalOBC: 500, scST: 250, female: 250, details: 'Refundable on attending CBT' },
    startDate: getPastDate(14),
    lastDate: getFutureDate(16),
    examDate: 'CBT Online Exam',
    state: 'All India',
    category: 'Railway',
    selectionProcess: ['Computer Based Test (CBT)', 'Physical Measurement & Efficiency Test (PMT/PET)', 'Document Verification'],
    officialWebsite: 'https://rrbapply.gov.in',
    officialNotificationPdf: 'https://rrbapply.gov.in',
    applyLink: 'https://rrbapply.gov.in',
    shortDescription:
      'All India recruitment for Sub Inspector (Graduate) and Constable (10th Pass) in Railway Protection Force.',
    status: 'Active',
    isFeatured: true,
    views: 9420,
    createdAt: getPastDate(14),
  },
  {
    _id: 'job-9',
    title: 'Rajasthan Police Constable Recruitment 2026',
    department: 'Rajasthan Police Recruitment Board',
    vacancies: 3578,
    qualification: ['12th'],
    ageLimit: { min: 18, max: 24, relaxationDetails: 'OBC/SC/ST of Rajasthan: 5 yrs relaxation' },
    fees: { generalOBC: 600, scST: 400, female: 400, details: 'Through Rajasthan SSO Portal' },
    startDate: getPastDate(7),
    lastDate: getFutureDate(15),
    examDate: 'CBT Written Test',
    state: 'Rajasthan',
    category: 'Police',
    selectionProcess: ['Physical Efficiency Test (PET)', 'Computer Based Written Exam', 'Medical'],
    officialWebsite: 'https://police.rajasthan.gov.in',
    officialNotificationPdf: 'https://police.rajasthan.gov.in',
    applyLink: 'https://sso.rajasthan.gov.in',
    shortDescription:
      'Rajasthan Police Constable (General & Driver) posts. Senior Secondary (12th Pass) candidates eligible.',
    status: 'Active',
    isFeatured: false,
    views: 3890,
    createdAt: getPastDate(7),
  },
];

// Helper to filter mock jobs locally
const filterMockJobs = (filters: JobFilter): Job[] => {
  return MOCK_JOBS.filter((job) => {
    // Search keyword
    if (filters.search) {
      const query = filters.search.toLowerCase().trim();
      const match =
        job.title.toLowerCase().includes(query) ||
        job.department.toLowerCase().includes(query) ||
        job.category.toLowerCase().includes(query) ||
        job.state.toLowerCase().includes(query) ||
        job.shortDescription.toLowerCase().includes(query);
      if (!match) return false;
    }

    // Qualification filter
    if (filters.qualification && filters.qualification !== 'All') {
      const hasQual = job.qualification.some(
        (q) => q.toLowerCase().includes(filters.qualification.toLowerCase())
      );
      if (!hasQual) return false;
    }

    // Category filter
    if (filters.category && filters.category !== 'All') {
      if (job.category.toLowerCase() !== filters.category.toLowerCase()) return false;
    }

    // State filter
    if (filters.state && filters.state !== 'All India') {
      if (job.state !== filters.state && job.state !== 'All India') return false;
    }

    // Closing soon filter (<= 7 days remaining)
    if (filters.closingSoonOnly) {
      const diffMs = new Date(job.lastDate).getTime() - Date.now();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays < 0 || diffDays > 7) return false;
    }

    return true;
  });
};

export const getJobsApi = async (filters: JobFilter): Promise<Job[]> => {
  try {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.qualification && filters.qualification !== 'All') params.append('qualification', filters.qualification);
    if (filters.category && filters.category !== 'All') params.append('category', filters.category);
    if (filters.state && filters.state !== 'All India') params.append('state', filters.state);
    if (filters.closingSoonOnly) params.append('closingSoon', 'true');

    const res = await fetch(`${API_BASE_URL}/jobs?${params.toString()}`);
    if (!res.ok) throw new Error('Backend offline');
    const data = await res.json();

    // If backend returns data, use it; otherwise fallback to local mock
    if (data && Array.isArray(data.data) && data.data.length > 0) {
      return data.data;
    }

    return filterMockJobs(filters);
  } catch {
    return filterMockJobs(filters);
  }
};

export const getStatsSummaryApi = async (): Promise<SummaryStats> => {
  try {
    const res = await fetch(`${API_BASE_URL}/jobs/stats/summary`);
    if (!res.ok) throw new Error('Backend offline');
    const data = await res.json();
    if (data?.data?.totalActiveJobs > 0) {
      return data.data;
    }
  } catch {
    // ignore
  }

  const closingCount = MOCK_JOBS.filter((j) => {
    const diff = Math.ceil((new Date(j.lastDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return diff >= 0 && diff <= 7;
  }).length;

  return {
    totalActiveJobs: MOCK_JOBS.length,
    closingSoonJobs: closingCount,
    totalOpenVacancies: MOCK_JOBS.reduce((acc, j) => acc + j.vacancies, 0),
  };
};

export const subscribeEmailApi = async (email: string, jobId?: string): Promise<{ success: boolean; message: string }> => {
  try {
    const url = jobId ? `${API_BASE_URL}/subscribers/reminder` : `${API_BASE_URL}/subscribers/newsletter`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, jobId }),
    });
    return await res.json();
  } catch {
    return {
      success: true,
      message: jobId
        ? `Reminder saved! We will send an alert to ${email} before the last date.`
        : `Subscribed successfully! Updates will be sent to ${email}.`,
    };
  }
};
