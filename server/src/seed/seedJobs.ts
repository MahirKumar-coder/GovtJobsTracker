import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Job } from '../models/Job';

dotenv.config();

const sampleJobs = [
  {
    title: 'SSC CGL 2026 Combined Graduate Level Exam',
    department: 'Staff Selection Commission (SSC)',
    vacancies: 14582,
    qualification: ['Graduate'],
    ageLimit: {
      min: 18,
      max: 32,
      relaxationDetails: 'OBC: 3 yrs, SC/ST: 5 yrs, PwD: 10 yrs',
    },
    fees: {
      generalOBC: 100,
      scST: 0,
      female: 0,
      details: 'Exempted for Women candidates and SC/ST/PwD/ESM',
    },
    startDate: new Date('2026-10-15'),
    lastDate: new Date('2026-11-20'),
    examDate: 'Tier-1: Jan 2027',
    state: 'All India',
    category: 'SSC',
    selectionProcess: ['Tier-1 Computer Based Test', 'Tier-2 CBT', 'Document Verification & Medical'],
    officialWebsite: 'https://ssc.gov.in',
    officialNotificationPdf: 'https://ssc.gov.in/notice-ssc-cgl-2026.pdf',
    applyLink: 'https://ssc.gov.in/apply',
    shortDescription:
      'Recruitment for Group B and Group C posts including Inspector (Central Excise/IT), Assistant Section Officer (CSS), Sub Inspector (CBI), and Auditor.',
    status: 'Active',
    isFeatured: true,
    views: 4520,
  },
  {
    title: 'RRB NTPC Non-Technical Popular Categories Recruitment 2026',
    department: 'Railway Recruitment Boards (RRB)',
    vacancies: 11558,
    qualification: ['12th', 'Graduate'],
    ageLimit: {
      min: 18,
      max: 33,
      relaxationDetails: 'OBC: 3 yrs, SC/ST: 5 yrs',
    },
    fees: {
      generalOBC: 500,
      scST: 250,
      female: 250,
      details: '₹400 refunded after appearing in Stage 1 CBT for Gen/OBC; full refund for reserved',
    },
    startDate: new Date('2026-10-01'),
    lastDate: new Date('2026-11-12'),
    examDate: 'CBT 1: Dec 2026 - Jan 2027',
    state: 'All India',
    category: 'Railway',
    selectionProcess: ['1st Stage CBT', '2nd Stage CBT', 'Typing Skill Test / CBAT', 'Document Verification'],
    officialWebsite: 'https://indianrailways.gov.in',
    officialNotificationPdf: 'https://rrbcdg.gov.in/advt-ntpc-2026.pdf',
    applyLink: 'https://rrbapply.gov.in',
    shortDescription:
      'Indian Railways mega hiring for Station Master, Goods Train Manager, Junior Clerk cum Typist, Accounts Clerk, and Senior Clerk.',
    status: 'Active',
    isFeatured: true,
    views: 7890,
  },
  {
    title: 'IBPS PO XIV Probationary Officers Recruitment',
    department: 'Institute of Banking Personnel Selection (IBPS)',
    vacancies: 4455,
    qualification: ['Graduate'],
    ageLimit: {
      min: 20,
      max: 30,
      relaxationDetails: 'OBC: 3 yrs, SC/ST: 5 yrs',
    },
    fees: {
      generalOBC: 850,
      scST: 175,
      female: 850,
      details: 'Includes GST. Online payment only.',
    },
    startDate: new Date('2026-10-25'),
    lastDate: new Date('2026-11-18'),
    examDate: 'Prelims: Dec 2026 | Mains: Jan 2027',
    state: 'All India',
    category: 'Banking',
    selectionProcess: ['Online Preliminary Exam', 'Online Main Exam', 'Common Interview by participating banks'],
    officialWebsite: 'https://ibps.in',
    officialNotificationPdf: 'https://ibps.in/crp-po-xiv-details.pdf',
    applyLink: 'https://ibps.in/apply-po-xiv',
    shortDescription:
      'Recruitment of Probationary Officers / Management Trainees in 11 participating public sector banks including PNB, BoB, Canara Bank, and Union Bank.',
    status: 'Active',
    isFeatured: false,
    views: 3120,
  },
  {
    title: 'Bihar Police Sub Inspector (Daroga) Recruitment 2026',
    department: 'Bihar Police Sub-ordinate Services Commission (BPSSC)',
    vacancies: 2128,
    qualification: ['Graduate'],
    ageLimit: {
      min: 20,
      max: 37,
      relaxationDetails: 'OBC/EBC (Male/Female): 40 yrs, SC/ST: 42 yrs',
    },
    fees: {
      generalOBC: 700,
      scST: 400,
      female: 400,
      details: 'Domicile reservation applicable as per Bihar Govt rules',
    },
    startDate: new Date('2026-10-10'),
    lastDate: new Date('2026-11-10'),
    examDate: 'Prelims Exam: 22 Dec 2026',
    state: 'Bihar',
    category: 'Police',
    selectionProcess: ['Preliminary Written Exam (200 marks)', 'Main Written Exam', 'Physical Efficiency Test (PET)', 'Medical'],
    officialWebsite: 'https://bpssc.bih.nic.in',
    officialNotificationPdf: 'https://bpssc.bih.nic.in/Advt-02-2026.pdf',
    applyLink: 'https://bpssc.bih.nic.in/apply-online',
    shortDescription:
      'Direct recruitment for Police Sub-Inspector posts in Home (Police) Department, Govt of Bihar. Bachelor degree in any discipline eligible.',
    status: 'Active',
    isFeatured: true,
    views: 6540,
  },
  {
    title: 'UP Police Constable & PAC Recruitment 2026',
    department: 'Uttar Pradesh Police Recruitment and Promotion Board (UPPRPB)',
    vacancies: 18450,
    qualification: ['10th', '12th'],
    ageLimit: {
      min: 18,
      max: 25,
      relaxationDetails: '5 years relaxation for SC/ST/OBC of Uttar Pradesh',
    },
    fees: {
      generalOBC: 400,
      scST: 400,
      female: 400,
      details: 'Uniform application fee for all candidate categories',
    },
    startDate: new Date('2026-10-20'),
    lastDate: new Date('2026-11-25'),
    examDate: 'OMR Written Test: Jan 2027',
    state: 'Uttar Pradesh',
    category: 'Police',
    selectionProcess: ['Written Exam (OMR Based)', 'Document Verification & Physical Standard Test (PST)', 'Physical Efficiency Test (Run)'],
    officialWebsite: 'https://uppbpb.gov.in',
    officialNotificationPdf: 'https://uppbpb.gov.in/notice-constable-2026.pdf',
    applyLink: 'https://uppbpb.gov.in/apply',
    shortDescription:
      'Massive recruitment for Civil Police Constables and Armed Constabulary (PAC). Intermediate (12th pass) from recognized board required.',
    status: 'Active',
    isFeatured: true,
    views: 8900,
  },
  {
    title: 'CTET 2026 Central Teacher Eligibility Test',
    department: 'Central Board of Secondary Education (CBSE)',
    vacancies: 0,
    qualification: ['Diploma', 'Graduate', 'B.Ed/D.El.Ed'],
    ageLimit: {
      min: 18,
      max: 50,
      relaxationDetails: 'No upper age limit specified by CBSE',
    },
    fees: {
      generalOBC: 1000,
      scST: 500,
      female: 1000,
      details: 'Paper I or II: ₹1000. Both Papers: ₹1200 (General/OBC). Reserved: ₹500 / ₹600.',
    },
    startDate: new Date('2026-11-01'),
    lastDate: new Date('2026-11-30'),
    examDate: 'Exam Date: 14 Dec 2026',
    state: 'All India',
    category: 'Teaching',
    selectionProcess: ['Paper-1 (Primary I-V)', 'Paper-2 (Upper Primary VI-VIII) Multiple Choice Questions'],
    officialWebsite: 'https://ctet.nic.in',
    officialNotificationPdf: 'https://ctet.nic.in/Information-Bulletin-CTET-2026.pdf',
    applyLink: 'https://ctet.nic.in/online-application',
    shortDescription:
      'Eligibility certificate for teaching appointment in Central Government schools (KVS, NVS, Central Tibetan Schools) and UTs.',
    status: 'Active',
    isFeatured: false,
    views: 4210,
  },
  {
    title: 'Indian Airforce Agniveervayu (Intake 01/2027)',
    department: 'Indian Air Force (IAF)',
    vacancies: 3500,
    qualification: ['10th', '12th', 'Diploma'],
    ageLimit: {
      min: 17,
      max: 21,
      relaxationDetails: 'Date of birth strictly between 02 Jan 2006 and 02 July 2009',
    },
    fees: {
      generalOBC: 550,
      scST: 550,
      female: 550,
      details: 'GST extra as applicable',
    },
    startDate: new Date('2026-10-18'),
    lastDate: new Date('2026-11-15'),
    examDate: 'Online Exam: 17 Jan 2027',
    state: 'All India',
    category: 'Defence',
    selectionProcess: ['Phase-1 Online Test', 'Phase-2 Physical Fitness Test (PFT) & Adaptability Test', 'Medical Examination'],
    officialWebsite: 'https://agnipathvayu.cdac.in',
    officialNotificationPdf: 'https://agnipathvayu.cdac.in/intake-01-2027.pdf',
    applyLink: 'https://agnipathvayu.cdac.in/apply',
    shortDescription:
      'Opportunity to serve the nation as Agniveervayu in the Indian Air Force for a duration of four years with handsome package and skill certificate.',
    status: 'Active',
    isFeatured: false,
    views: 5120,
  },
];

const seed = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/govjobs_tracker';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB');

    await Job.deleteMany({});
    console.log('[Seed] Cleared existing jobs');

    const created = await Job.insertMany(sampleJobs);
    console.log(`[Seed] Successfully inserted ${created.length} verified government job notices!`);

    await mongoose.disconnect();
    console.log('[Seed] Done & disconnected');
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error seeding jobs:', error);
    process.exit(1);
  }
};

seed();
