export interface Job {
  _id: string;
  title: string;
  department: string;
  vacancies: number;
  qualification: string[];
  ageLimit: {
    min: number;
    max: number;
    relaxationDetails?: string;
  };
  fees: {
    generalOBC: number;
    scST: number;
    female?: number;
    details?: string;
  };
  startDate: string;
  lastDate: string;
  examDate?: string;
  state: string;
  category: string;
  selectionProcess?: string[];
  officialWebsite: string;
  officialNotificationPdf?: string;
  applyLink: string;
  shortDescription: string;
  status: 'Active' | 'Closed' | 'Upcoming';
  isFeatured?: boolean;
  views?: number;
  createdAt: string;
}

export interface JobFilter {
  search: string;
  qualification: string;
  category: string;
  state: string;
  closingSoonOnly: boolean;
}

export interface SummaryStats {
  totalActiveJobs: number;
  closingSoonJobs: number;
  totalOpenVacancies: number;
}
