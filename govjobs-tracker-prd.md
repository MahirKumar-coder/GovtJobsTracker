# GovJobs Tracker: PRD

**Version:** 1.0 | **Owner:** Mahir Kumar | **Date:** 6 Nov 2026

## 1. Overview

GovJobs Tracker ek website hai jahan users ko latest sarkari naukri ki notifications ek hi jagah mil jaati hain: vacancy, eligibility, last date, aur official apply link. Alag-alag websites pe bhatakna nahi padega.

## 2. Problem Statement

- Sarkari jobs ki info bahut jagah bikhri hui hai (UPSC, SSC, Railway, Banking, State PSC, etc.).
- Fake ya purane notifications aur spam sites bahut hain, jisse students confuse hote hain.
- Last date miss ho jaati hai kyunki koi reminder system nahi hota.

## 3. Goals aur Success Metrics

**Goals:**

- Ek jagah pe verified aur latest govt job notifications dena.
- User ko uske qualification ke hisaab se sahi jobs dikhana.
- Last date se pehle reminder dena.

**Success metrics:**

- 3 mahine mein 5,000 monthly visitors
- 30% users search ya filter use karein
- 500+ email/WhatsApp subscribers
- Page load time 3 sec se kam

## 4. Target Users

| User | Kaun hai | Need |
|---|---|---|
| Job Seeker | 12th pass / graduate / diploma student, 18-35 age | Apni eligibility ki jobs dhundna |
| Parents/Guardians | Bachon ke liye info dhundte hain | Simple aur trusted info |
| Admin | Website owner (tum) | Jobs add/edit/delete karna |

## 5. User Stories

- Main ek student hoon, mujhe latest jobs dekhni hain, taaki koi vacancy miss na ho.
- Main ek graduate hoon, mujhe qualification se filter karna hai, taaki sirf kaam ki jobs dikhein.
- Main user hoon, mujhe last date ka reminder chahiye, taaki apply karna na bhoolun.
- Main admin hoon, mujhe naye job post add karne hain, taaki site update rahe.

## 6. Features

**P0 (Must have)**

- Home page pe latest jobs ki list (naam, department, last date, vacancies)
- Job detail page: eligibility, age limit, fees, selection process, important dates, official link
- Search bar (job name, department)
- Filters: qualification (10th/12th/Graduate/Diploma), state, department, category (Railway, Banking, SSC, Defence, Police, Teaching)
- Admin panel: job add/edit/delete
- Mobile responsive design

**P1 (Should have)**

- Last date reminder via email (WhatsApp/Telegram baad mein)
- "Closing soon" section
- Admit card, result, answer key sections
- Bookmark / save job (login ke saath)

**P2 (Nice to have)**

- Hindi + English dono language
- Dark mode
- Exam syllabus aur previous papers ke links
- Push notifications
- Auto-fetch jobs official sites se (scraping/API)

## 7. Scope

**In scope (v1):** Job listing, detail, search, filter, admin panel, email alerts.

**Out of scope (v1):** Online application form khud submit karna, payment, coaching content, mobile app.

## 8. User Flow

**User flow:**

1. User home page kholta hai, latest jobs dikhti hain.
2. Search ya filter lagata hai.
3. Job card pe click karke detail page dekhta hai.
4. "Apply on Official Site" pe click karta hai, ya reminder set karta hai.

**Admin flow:**

1. Admin login karta hai.
2. "Add Job" form bharta hai.
3. Publish karta hai.

## 9. Non-Functional Requirements

- **Performance:** Page 3 sec ke andar load ho.
- **Security:** Admin login protected ho (JWT), passwords hashed hon.
- **SEO:** Har job page ka alag title, meta description, URL (Google pe rank karne ke liye zaroori).
- **Responsive:** Mobile pe sabse accha chale, kyunki zyada users phone se aayenge.
- **Accuracy:** Har job ke saath official source link aur "last updated" date ho.

## 10. Tech Stack

| Layer | Choice |
|---|---|
| Frontend | React.js + TypeScript |
| Backend | Node.js + Express.js |
| Database | MongoDB |
| Email alerts | Nodemailer ya SendGrid |
| Hosting | Vercel (frontend), Render/Railway (backend), MongoDB Atlas |

## 11. Data Model

| Entity | Fields |
|---|---|
| Job | title, department, vacancies, qualification, age limit, fees, start date, last date, state, category, official link, status, created date |
| User | name, email, saved jobs, alert preferences |

## 12. Timeline

| Week | Kaam |
|---|---|
| 1 | Research, wireframes, DB design |
| 2 | Backend APIs (jobs CRUD, search, filter) |
| 3 | Frontend pages (home, detail, filters) |
| 4 | Admin panel + auth |
| 5 | Email alerts, SEO, testing |
| 6 | Deploy + launch |

## 13. Risks aur Assumptions

| Risk | Solution |
|---|---|
| Galat ya fake info post ho jaye | Sirf official site se verify karke daalo, source link zaroor do |
| Data manually daalna time leta hai | Baad mein scraping/RSS add karo |
| Traffic kam rahe | SEO, Telegram/WhatsApp channel, social media |
| Copyright issue | Official notice copy-paste na karo, apne words mein summary likho aur source link do |

**Assumptions:** Admin roz jobs update karega; users mainly mobile se aayenge.

## 14. Open Questions

- Monetization kya hogi (Google AdSense, sponsored coaching ads)?
- Sirf Bihar ya poore India ki jobs?
- Login compulsory hoga ya optional?
