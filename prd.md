# Product Requirements Document (PRD) - Hireloop (AI-Powered Job Board & Recruitment Platform)

> **Agent Instruction:** Read this document completely before planning, writing code, or solving any queries related to this project. This document defines the core architecture, user roles, UI/UX patterns, and functional requirements derived from the system's design specifications.

---

## 1. App Overview

### 1.1 Product Vision & Summary
**Hireloop** is a modern, dark-mode SaaS recruitment and job marketplace platform designed to connect job seekers with high-impact roles using AI-driven tools and leveraged subscription tiers ("Pay for the leverage, not the listings"). It serves three distinct authenticated user personas—**Job Seekers**, **Recruiters**, and **Platform Administrators**—alongside a public-facing marketing and job discovery portal.

### 1.2 Target Audience & User Roles
1. **Public / Unauthenticated Visitors:** Can explore the landing page, search/filter open job listings, view job details, compare pricing plans, and initiate subscription checkout.
2. **Job Seeker:** Candidates looking for roles. They can search jobs, save listings, track application statuses, utilize AI resume/matching tools, manage their professional profile, and upgrade their subscription tier for boosted visibility/features.
3. **Recruiter (Employer):** Hiring managers and talent acquisition teams. They can post and manage job listings, review incoming candidate pipelines, view AI candidate match scores, and manage company profiles.
4. **Admin (Platform Administrator):** System operators responsible for platform-wide analytics, user management (seekers & recruiters), job moderation/approvals, and subscription/revenue oversight.

### 1.3 Design System & UI/UX Philosophy
* **Theme:** Sleek, high-contrast **Dark Mode** (`#09090B` / `#111113` background surfaces with `#18181B` / `#1F1F23` card containers).
* **Brand Accents:** Vibrant Violet/Indigo (`#6366F1` / `#7C3AED`) primary buttons and glow effects, paired with warm amber/orange logo highlights and semantic status badges (Emerald Green for active/hired/success, Amber for pending/review, Rose/Red for rejected/closed).
* **Layout Architecture:**
  * **Public Pages:** Top navigation bar with centered hero search, metric cards, grid-based job previews, feature highlights, pricing tables, and multi-column footer.
  * **Authenticated Portals (Seeker, Recruiter, Admin):** Persistent left-hand collapsible sidebar navigation + top header bar (breadcrumbs, quick actions, notifications, user profile) + main workspace area featuring KPI stat cards, data tables, and slide-over/modal forms.

---

## 2. All Detailed Features

### 2.1 Public Site (Landing, Browse, Job Details & Checkout)
* **Landing Page (`Homepage`):**
  * **Navigation Header:** Brand logo, navigation links (Browse Jobs, Pricing, For Recruiters), `Login`, and primary `Get Started` CTA.
  * **Hero Section:** High-impact headline (*"Find Your Dream Job Today"*), dual-input search bar (Job Title/Keywords + Location), quick-filter tags, and a stylized 3D-glowing globe visual backdrop.
  * **Social Proof & Platform Metrics:** 4-column KPI strip highlighting platform scale (e.g., `50K+` Active Jobs, `12K+` Companies, `2M+` Job Seekers, `97%` Success Rate).
  * **Curated Job Showcase (*"The roles you'd never find by searching"*):** 3x2 grid of featured job cards displaying role title, short description, salary/type/location pills, and `Apply Now` action, followed by a `See All Jobs` CTA.
  * **Platform Value Propositions (*"Everything you need to succeed"*):** 8-card feature grid detailing AI Resume Optimization, Smart Job Matching, Direct Recruiter Messaging, Application Tracking, Salary Insights, etc.
  * **Subscription Pricing (*"Pay for the leverage, not the listings"*):**
    * Billing cycle toggle (`Monthly` vs `Yearly` with discount badge).
    * **3 Tiers:**
      1. **Free / Starter (`$0/mo`):** Basic job search, standard profile, limited daily applications.
      2. **Pro / Growth (`$17/mo` - Highlighted/Popular):** AI resume tailoring, priority application placement, unlimited tracking, recruiter insights.
      3. **Executive / Scale (`$99/mo`):** Dedicated career concierge, 1-on-1 coaching, automated outreach, full AI suite.
  * **Bottom CTA & Footer:** Final conversion banner (*"Your next role is already looking for you"*) and structured footer links.
* **Job Discovery & Browse (`01 - Public Site`):**
  * Left-hand multi-faceted filter sidebar (Job Type, Experience Level, Salary Range, Remote/On-site, Date Posted).
  * Real-time keyword & location search bar with sorting options (Newest, Highest Salary, Best Match).
  * Interactive list/card view of open roles with quick-save bookmarks.
* **Job Details View:**
  * Comprehensive job breakdown: Company header, role metadata (Location, Salary, Type, Posted Date), full rich-text Job Description, Requirements, Benefits, and a sticky sidebar card with `Apply Now` and company overview.
* **Subscription Checkout & Confirmation Flow:**
  * Stripe-style clean dark-mode checkout screen showing selected plan summary, billing cycle toggle, promo code input, payment card details form, and total breakdown.
  * Dedicated **Payment Success / Confirmation** state with transaction receipt summary and direct CTA to enter the Dashboard.

---

### 2.2 Job Seeker Portal (`02 - Job Seeker`)
* **Seeker Dashboard Overview:**
  * Top KPI summary cards (Total Applications, Interviews Scheduled, Profile Views, AI Match Score average).
  * Recent applications activity feed and recommended AI-matched jobs widget.
* **Job Search & AI Recommendations:**
  * Personalized job feed ranked by AI compatibility score against the user's profile and resume.
  * One-click apply workflow using stored profile/resume data.
* **Saved Jobs & Bookmarks:**
  * Dedicated tab/view to manage bookmarked opportunities, compare roles, and convert saved jobs into active applications.
* **Application Tracker:**
  * Tabular/pipeline view of all submitted applications with real-time status badges (`Applied`, `Under Review`, `Interview`, `Offer`, `Rejected`), applied dates, and company details.
* **Subscription & Billing Management:**
  * View current active plan (e.g., Pro), usage limits/credits, billing history/invoices table, payment method management, and one-click plan upgrade/downgrade options.
* **Candidate Profile & Resume Settings:**
  * Comprehensive profile editor: Avatar upload, headline, bio, skills tags, work experience timeline, education, portfolio links, and default PDF resume upload/parsing.

---

### 2.3 Recruiter Portal (`03 - Recruiter`)
* **Recruiter Overview Dashboard:**
  * Hiring KPI cards (Active Job Posts, Total Applicants, Shortlisted Candidates, Time-to-Hire metrics).
  * Recent applicant submissions feed and active job performance summary.
* **Create & Edit Job Listing:**
  * Structured multi-section form: Job Title, Department, Employment Type, Location/Remote policy, Compensation Range, Rich-text Description, Required Skills tags, and Screening Questions.
  * Ability to save as Draft or Publish immediately.
* **Manage Job Listings:**
  * Data table of all company jobs with columns for Role Title, Status (`Active`, `Paused`, `Closed`, `Draft`), Applicant Count, Views, Posted Date, and quick actions (Edit, Pause/Close, View Applicants).
* **Applicant Tracking & Candidate Review (ATS):**
  * Job-specific candidate pipeline table displaying Candidate Name, AI Match Score (%), Application Date, Current Stage (`New`, `Shortlisted`, `Interview`, `Hired`, `Rejected`), Resume preview trigger, and status update controls.
* **Company Profile & Settings:**
  * Manage employer branding: Company logo, name, industry, company size, website, headquarters location, and "About Us" description displayed on public job pages.

---

### 2.4 Admin Console (`04 - Admin Console`)
* **Platform Analytics & System Overview:**
  * Executive KPI cards: Total Users, Total Active Jobs, Monthly Recurring Revenue (MRR), and Platform Conversion Rate.
  * Growth charts and recent platform activity logs (new signups, newly posted jobs, recent subscription upgrades).
* **User Management (Seekers & Recruiters):**
  * Searchable, filterable directory of all registered users with role badges (`Job Seeker`, `Recruiter`, `Admin`), subscription tier, account status (`Active`, `Suspended`), join date, and administrative actions (View Details, Suspend/Ban, Change Role).
* **Job Moderation & Listings Oversight:**
  * Platform-wide table of all job postings across all companies.
  * Moderation controls to approve pending listings, flag/remove policy-violating posts, or feature high-priority jobs on the homepage.
* **Subscriptions, Revenue & Financial Logs:**
  * Transaction ledger showing all user subscription payments, plan tiers, billing intervals, payment statuses (`Succeeded`, `Failed`, `Refunded`), and exportable financial reporting.

---

## 3. Technical & Architectural Guidelines for Agents
* **State & Role-Based Access Control (RBAC):** Enforce strict route protection and UI rendering based on user role (`public`, `seeker`, `recruiter`, `admin`).
* **Responsive Design:** Ensure all data tables convert cleanly to scrollable containers or stacked cards on mobile viewports, and sidebars collapse into mobile drawers.
* **Component Reusability:** Standardize core UI primitives across all portals: `StatCard`, `DataTable` (with search, filter, and pagination), `StatusBadge`, `JobCard`, `PricingCard`, and `Modal/Drawer` forms.