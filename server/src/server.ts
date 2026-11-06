import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import jobRoutes from './routes/jobRoutes';
import authRoutes from './routes/authRoutes';
import subscriberRoutes from './routes/subscriberRoutes';
import adminRoutes from './routes/adminRoutes';
import { startScheduler } from './services/scheduler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middlewares
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use('/api/jobs', jobRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/subscribers', subscriberRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'GovJobs Tracker API',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// Root welcome
app.get('/', (_req: Request, res: Response) => {
  res.send('GovJobs Tracker API is running smoothly. Visit /api/jobs for job listings.');
});

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: express.NextFunction) => {
  console.error('[Server Error]:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`[Server] GovJobs Tracker backend running on http://localhost:${PORT}`);
  // Start RSS auto-fetch scheduler
  startScheduler();
});
