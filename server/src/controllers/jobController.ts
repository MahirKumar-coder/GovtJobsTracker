import { Request, Response } from 'express';
import { Job } from '../models/Job';

// GET /api/jobs
export const getJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      search,
      qualification,
      category,
      state,
      status,
      closingSoon,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    const query: any = {};

    // Status filter (default to Active if not specified)
    if (status) {
      query.status = status;
    }

    // Qualification filter (10th, 12th, Graduate, etc.)
    if (qualification) {
      const quals = Array.isArray(qualification) ? qualification : [qualification];
      query.qualification = { $in: quals };
    }

    // Category filter (Railway, Banking, SSC, Police, etc.)
    if (category) {
      query.category = category;
    }

    // State filter (All India, Bihar, UP, etc.)
    if (state && state !== 'All India') {
      query.state = state;
    }

    // Search query (keyword matching in title, department, or description)
    if (search && typeof search === 'string' && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { department: { $regex: search.trim(), $options: 'i' } },
        { category: { $regex: search.trim(), $options: 'i' } },
        { state: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // Closing soon filter (closing in the next 7 days)
    if (closingSoon === 'true') {
      const now = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(now.getDate() + 7);
      query.lastDate = { $gte: now, $lte: nextWeek };
      query.status = 'Active';
    }

    const pageNum = Math.max(1, parseInt(page as string, 10));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit as string, 10)));
    const skip = (pageNum - 1) * limitNum;

    const sortOptions: any = {};
    if (sortBy === 'lastDate') {
      sortOptions.lastDate = order === 'desc' ? -1 : 1;
    } else if (sortBy === 'vacancies') {
      sortOptions.vacancies = order === 'desc' ? -1 : 1;
    } else {
      sortOptions.createdAt = order === 'desc' ? -1 : 1;
    }

    let total = await Job.countDocuments(query);

    // If database is completely empty and no search was performed, auto-insert initial sample jobs
    if (total === 0 && Object.keys(query).length === 0) {
      const defaultSampleJobs = [
        {
          title: 'SSC CGL 2026 Combined Graduate Level Exam',
          department: 'Staff Selection Commission (SSC)',
          vacancies: 14582,
          qualification: ['Graduate'],
          startDate: new Date(),
          lastDate: new Date(Date.now() + 14 * 86400000),
          state: 'All India',
          category: 'SSC',
          officialWebsite: 'https://ssc.gov.in',
          applyLink: 'https://ssc.gov.in',
          shortDescription: 'Recruitment for Group B & C posts including Inspector, ASO, and Auditor.',
          status: 'Active',
          isFeatured: true,
        },
        {
          title: 'RRB NTPC Non-Technical Categories Recruitment',
          department: 'Railway Recruitment Boards (RRB)',
          vacancies: 11558,
          qualification: ['12th', 'Graduate'],
          startDate: new Date(),
          lastDate: new Date(Date.now() + 4 * 86400000),
          state: 'All India',
          category: 'Railway',
          officialWebsite: 'https://indianrailways.gov.in',
          applyLink: 'https://rrbapply.gov.in',
          shortDescription: 'Station Master, Goods Guard, Senior Clerk posts across Indian Railways.',
          status: 'Active',
          isFeatured: true,
        },
        {
          title: 'Bihar Police Sub Inspector (Daroga) 2026',
          department: 'BPSSC Bihar',
          vacancies: 2128,
          qualification: ['Graduate'],
          startDate: new Date(),
          lastDate: new Date(Date.now() + 3 * 86400000),
          state: 'Bihar',
          category: 'Police',
          officialWebsite: 'https://bpssc.bih.nic.in',
          applyLink: 'https://bpssc.bih.nic.in',
          shortDescription: 'Direct recruitment for Police Sub-Inspector in Govt of Bihar.',
          status: 'Active',
          isFeatured: true,
        },
        {
          title: 'UP Police Constable Recruitment 2026',
          department: 'UPPRPB Uttar Pradesh',
          vacancies: 18450,
          qualification: ['10th', '12th'],
          startDate: new Date(),
          lastDate: new Date(Date.now() + 20 * 86400000),
          state: 'Uttar Pradesh',
          category: 'Police',
          officialWebsite: 'https://uppbpb.gov.in',
          applyLink: 'https://uppbpb.gov.in',
          shortDescription: 'Civil Police Constables and PAC recruitment for 12th pass.',
          status: 'Active',
          isFeatured: true,
        },
      ];
      await Job.insertMany(defaultSampleJobs);
      total = await Job.countDocuments(query);
    }

    const jobs = await Job.find(query).sort(sortOptions).skip(skip).limit(limitNum).lean();

    res.json({
      success: true,
      data: jobs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error fetching jobs' });
  }
};

// GET /api/jobs/:id
export const getJobById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const job = await Job.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });

    if (!job) {
      res.status(404).json({ success: false, message: 'Job notification not found' });
      return;
    }

    res.json({ success: true, data: job });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching job details' });
  }
};

// POST /api/jobs (Admin only)
export const createJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const job = new Job(req.body);
    await job.save();

    res.status(201).json({ success: true, message: 'Job notification posted successfully', data: job });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Failed to create job' });
  }
};

// PUT /api/jobs/:id (Admin only)
export const updateJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const job = await Job.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    if (!job) {
      res.status(404).json({ success: false, message: 'Job not found to update' });
      return;
    }

    res.json({ success: true, message: 'Job updated successfully', data: job });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Failed to update job' });
  }
};

// DELETE /api/jobs/:id (Admin only)
export const deleteJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const job = await Job.findByIdAndDelete(id);

    if (!job) {
      res.status(404).json({ success: false, message: 'Job not found to delete' });
      return;
    }

    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to delete job' });
  }
};

// GET /api/jobs/stats/summary
export const getStatsSummary = async (_req: Request, res: Response): Promise<void> => {
  try {
    const now = new Date();
    const next7Days = new Date();
    next7Days.setDate(now.getDate() + 7);

    const [totalActive, closingSoonCount, aggregateVacancies] = await Promise.all([
      Job.countDocuments({ status: 'Active' }),
      Job.countDocuments({ status: 'Active', lastDate: { $gte: now, $lte: next7Days } }),
      Job.aggregate([
        { $match: { status: 'Active' } },
        { $group: { _id: null, totalVacancies: { $sum: '$vacancies' } } },
      ]),
    ]);

    const totalVacancies = aggregateVacancies.length > 0 ? aggregateVacancies[0].totalVacancies : 0;

    res.json({
      success: true,
      data: {
        totalActiveJobs: totalActive,
        closingSoonJobs: closingSoonCount,
        totalOpenVacancies: totalVacancies,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch summary stats' });
  }
};
