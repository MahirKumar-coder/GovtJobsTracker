import mongoose, { Document, Schema } from 'mongoose';

export interface IJob extends Document {
  title: string;
  department: string;
  vacancies: number;
  qualification: string[]; // e.g. ['10th', '12th', 'Graduate', 'Post Graduate', 'Diploma', 'B.Tech']
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
  startDate: Date;
  lastDate: Date;
  examDate?: string;
  state: string; // 'All India', 'Bihar', 'Uttar Pradesh', 'Rajasthan', etc.
  category: string; // 'Railway', 'Banking', 'SSC', 'UPSC', 'Defence', 'Police', 'Teaching', 'State PSC', 'Other'
  selectionProcess?: string[]; // e.g. ['Written Exam', 'Physical Test', 'Interview']
  officialWebsite: string;
  officialNotificationPdf?: string;
  applyLink: string;
  shortDescription: string;
  status: 'Active' | 'Closed' | 'Upcoming';
  isFeatured: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true, trim: true, index: true },
    department: { type: String, required: true, trim: true, index: true },
    vacancies: { type: Number, required: true, min: 0 },
    qualification: [{ type: String, required: true, index: true }],
    ageLimit: {
      min: { type: Number, required: true, default: 18 },
      max: { type: Number, required: true, default: 35 },
      relaxationDetails: { type: String, default: 'As per government rules' },
    },
    fees: {
      generalOBC: { type: Number, required: true, default: 0 },
      scST: { type: Number, required: true, default: 0 },
      female: { type: Number, default: 0 },
      details: { type: String, default: 'Online payment via NetBanking/UPI/Cards' },
    },
    startDate: { type: Date, required: true },
    lastDate: { type: Date, required: true, index: true },
    examDate: { type: String, default: 'To be notified soon' },
    state: { type: String, required: true, default: 'All India', index: true },
    category: { type: String, required: true, index: true },
    selectionProcess: [{ type: String }],
    officialWebsite: { type: String, required: true },
    officialNotificationPdf: { type: String },
    applyLink: { type: String, required: true },
    shortDescription: { type: String, required: true },
    status: {
      type: String,
      enum: ['Active', 'Closed', 'Upcoming'],
      default: 'Active',
      index: true,
    },
    isFeatured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Compound text index for search
JobSchema.index({ title: 'text', department: 'text', shortDescription: 'text' });

export const Job = mongoose.model<IJob>('Job', JobSchema);
