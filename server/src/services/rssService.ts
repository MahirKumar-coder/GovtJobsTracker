/**
 * RSS Auto-Fetch Service for GovJobs Tracker
 * 
 * Pulls job notifications from government RSS feeds and job portals.
 * Runs on a scheduled cron job every 6 hours.
 * 
 * Sources:
 * - NCS (National Career Service) RSS
 * - Sarkari Result RSS (via Google News)
 * - Google News RSS for "sarkari naukri"
 */

import axios from 'axios';
import xml2js from 'xml2js';
import { Job, IJob } from '../models/Job';

// ─── Types ───────────────────────────────────────────────────────────────────

interface RssItem {
  title?: string[];
  link?: string[];
  description?: string[];
  pubDate?: string[];
  'dc:creator'?: string[];
  guid?: string[];
}

interface ParsedFeed {
  rss?: { channel?: [{ item?: RssItem[] }] };
  feed?: { entry?: AtomEntry[] };
}

interface AtomEntry {
  title?: [{ _?: string } | string];
  link?: [{ $?: { href: string } }];
  summary?: [string];
  updated?: [string];
  id?: [string];
}

// ─── RSS Feed Sources ─────────────────────────────────────────────────────────

const RSS_SOURCES = [
  {
    url: 'https://news.google.com/rss/search?q=sarkari+naukri+2025+government+jobs+vacancy&hl=en-IN&gl=IN&ceid=IN:en',
    label: 'Google News - Sarkari Naukri',
  },
  {
    url: 'https://news.google.com/rss/search?q=SSC+recruitment+2025+notification&hl=en-IN&gl=IN&ceid=IN:en',
    label: 'Google News - SSC Recruitment',
  },
  {
    url: 'https://news.google.com/rss/search?q=railway+recruitment+board+RRB+2025&hl=en-IN&gl=IN&ceid=IN:en',
    label: 'Google News - Railway Recruitment',
  },
  {
    url: 'https://news.google.com/rss/search?q=UPSC+recruitment+notification+2025&hl=en-IN&gl=IN&ceid=IN:en',
    label: 'Google News - UPSC',
  },
  {
    url: 'https://news.google.com/rss/search?q=bank+recruitment+IBPS+SBI+2025&hl=en-IN&gl=IN&ceid=IN:en',
    label: 'Google News - Banking Jobs',
  },
];

// ─── Category Classifier ──────────────────────────────────────────────────────

function detectCategory(title: string): IJob['category'] {
  const t = title.toLowerCase();
  if (t.includes('railway') || t.includes('rrb') || t.includes('rrc')) return 'Railway';
  if (t.includes('bank') || t.includes('ibps') || t.includes('sbi') || t.includes('rbi')) return 'Banking';
  if (t.includes('ssc') || t.includes('staff selection')) return 'SSC';
  if (t.includes('upsc') || t.includes('civil service') || t.includes('ias') || t.includes('ips')) return 'UPSC';
  if (t.includes('police') || t.includes('constable') || t.includes('sub-inspector') || t.includes('si ')) return 'Police';
  if (t.includes('teacher') || t.includes('teaching') || t.includes('tet') || t.includes('school')) return 'Teaching';
  if (t.includes('army') || t.includes('navy') || t.includes('airforce') || t.includes('military') || t.includes('defence') || t.includes('nda')) return 'Defence';
  if (t.includes('psc') || t.includes('state') || t.includes('pcs')) return 'State PSC';
  return 'Other';
}

function detectQualification(text: string): string[] {
  const t = text.toLowerCase();
  const quals: string[] = [];
  if (t.includes('10th') || t.includes('matriculation') || t.includes('matric')) quals.push('10th');
  if (t.includes('12th') || t.includes('intermediate') || t.includes('higher secondary')) quals.push('12th');
  if (t.includes('diploma')) quals.push('Diploma');
  if (t.includes('b.tech') || t.includes('btech') || t.includes('engineering') || t.includes('be ')) quals.push('B.Tech');
  if (t.includes('graduate') || t.includes('graduation') || t.includes('bachelor') || t.includes('b.a') || t.includes('b.sc') || t.includes('b.com')) quals.push('Graduate');
  if (t.includes('post graduate') || t.includes('postgraduate') || t.includes('master') || t.includes('m.a') || t.includes('m.sc')) quals.push('Post Graduate');
  return quals.length > 0 ? quals : ['Graduate']; // Default
}

function detectState(text: string): string {
  const t = text.toLowerCase();
  const stateMap: Record<string, string> = {
    'uttar pradesh': 'Uttar Pradesh', 'up ': 'Uttar Pradesh',
    'bihar': 'Bihar',
    'rajasthan': 'Rajasthan',
    'madhya pradesh': 'Madhya Pradesh', 'mp ': 'Madhya Pradesh',
    'maharashtra': 'Maharashtra',
    'gujarat': 'Gujarat',
    'west bengal': 'West Bengal',
    'karnataka': 'Karnataka',
    'tamil nadu': 'Tamil Nadu',
    'andhra pradesh': 'Andhra Pradesh',
    'telangana': 'Telangana',
    'haryana': 'Haryana',
    'punjab': 'Punjab',
    'odisha': 'Odisha',
    'jharkhand': 'Jharkhand',
    'chhattisgarh': 'Chhattisgarh',
    'assam': 'Assam',
    'delhi': 'Delhi',
    'himachal': 'Himachal Pradesh',
    'uttarakhand': 'Uttarakhand',
    'kerala': 'Kerala',
  };

  for (const [key, value] of Object.entries(stateMap)) {
    if (t.includes(key)) return value;
  }
  return 'All India';
}

function extractVacancyCount(text: string): number {
  // Try to extract numbers like "1500 posts", "500 vacancies"
  const matches = text.match(/(\d[\d,]*)\s*(post|vacancy|vacancies|seat|recruitment)/i);
  if (matches) {
    return parseInt(matches[1].replace(/,/g, ''), 10);
  }
  return 0; // Unknown
}

// ─── Main Fetch Function ──────────────────────────────────────────────────────

async function fetchAndParseFeed(source: { url: string; label: string }): Promise<number> {
  try {
    console.log(`[RSS] Fetching: ${source.label}`);
    const response = await axios.get(source.url, {
      timeout: 15000,
      headers: {
        'User-Agent': 'GovJobs-Tracker/1.0 RSS Reader',
        'Accept': 'application/rss+xml, application/xml, text/xml',
      },
    });

    const parser = new xml2js.Parser({ explicitArray: true, ignoreAttrs: false });
    const result: ParsedFeed = await parser.parseStringPromise(response.data);

    const items: RssItem[] = result?.rss?.channel?.[0]?.item || [];
    let newCount = 0;

    for (const item of items.slice(0, 20)) { // Process max 20 per feed
      const rawTitle = item.title?.[0] || '';
      const rawLink = item.link?.[0] || '';
      const rawDescription = item.description?.[0] || '';
      const rawDate = item.pubDate?.[0];

      // Skip if title is empty or not govt job related
      if (!rawTitle || rawTitle.length < 10) continue;

      const combinedText = `${rawTitle} ${rawDescription}`;
      const isRelevant = /recruit|notif|vacanc|naukri|job|post|admit|result/i.test(combinedText);
      if (!isRelevant) continue;

      const category = detectCategory(rawTitle);
      const state = detectState(combinedText);
      const qualification = detectQualification(combinedText);
      const vacancies = extractVacancyCount(combinedText);

      // Create a unique fingerprint to avoid duplicate entries
      const titleHash = rawTitle.slice(0, 100);
      const existing = await Job.findOne({
        title: { $regex: titleHash.slice(0, 50), $options: 'i' },
      });

      if (existing) continue; // Skip duplicates

      // Parse dates
      const publishedDate = rawDate ? new Date(rawDate) : new Date();
      const lastDate = new Date(publishedDate);
      lastDate.setDate(lastDate.getDate() + 30); // Default: 30 days from publish

      // Extract department name from title
      const deptMatch = rawTitle.match(/^([^:–-]+)/);
      const department = deptMatch ? deptMatch[1].trim().slice(0, 80) : category;

      // Clean description (strip HTML)
      const cleanDesc = rawDescription
        .replace(/<[^>]*>/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&nbsp;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 500);

      const jobData = {
        title: rawTitle.slice(0, 200),
        department,
        vacancies: vacancies || 0,
        qualification,
        ageLimit: { min: 18, max: 35, relaxationDetails: 'As per government norms' },
        fees: { generalOBC: 0, scST: 0, female: 0, details: 'Check official notification' },
        startDate: publishedDate,
        lastDate,
        examDate: 'To be notified',
        state,
        category,
        selectionProcess: ['Written Exam', 'Interview'],
        officialWebsite: rawLink || 'https://www.ncs.gov.in',
        applyLink: rawLink || 'https://www.ncs.gov.in',
        shortDescription: cleanDesc || rawTitle,
        status: 'Active' as const,
        isFeatured: false,
        views: 0,
        source: 'rss-auto', // Track auto-fetched jobs
      };

      await Job.create(jobData);
      newCount++;
      console.log(`[RSS] ✅ Added: ${rawTitle.slice(0, 60)}...`);
    }

    return newCount;
  } catch (error: any) {
    console.error(`[RSS] ❌ Failed to fetch ${source.label}:`, error.message);
    return 0;
  }
}

// ─── Cleanup Expired Jobs ─────────────────────────────────────────────────────

async function markExpiredJobs(): Promise<void> {
  const now = new Date();
  const result = await Job.updateMany(
    { lastDate: { $lt: now }, status: 'Active' },
    { $set: { status: 'Closed' } }
  );
  if (result.modifiedCount > 0) {
    console.log(`[Cleanup] Marked ${result.modifiedCount} expired job(s) as Closed.`);
  }
}

// ─── Main Exported Function ───────────────────────────────────────────────────

export async function runRssFetch(): Promise<void> {
  console.log('\n[RSS Scheduler] Starting auto-fetch cycle...');
  const startTime = Date.now();
  let totalAdded = 0;

  for (const source of RSS_SOURCES) {
    const count = await fetchAndParseFeed(source);
    totalAdded += count;
    // Small delay between feeds to be respectful
    await new Promise(res => setTimeout(res, 2000));
  }

  await markExpiredJobs();

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`[RSS Scheduler] ✅ Cycle complete. Added ${totalAdded} new job(s) in ${duration}s\n`);
}
