import {
  ArrowLeft,
  Briefcase,
  Building2,
  CalendarDays,
  CheckCircle2,
  Code2,
  DollarSign,
  Globe,
  LineChart,
  ListChecks,
  MapPin,
  Palette,
  Pencil,
  PenTool,
  Target,
  Users,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { getJobById } from "@/lib/api/jobs";
import type { Job } from "@/types";

const CATEGORY_META: Record<string, { icon: typeof Code2; classes: string }> = {
  "Engineering & Tech": {
    icon: Code2,
    classes: "bg-blue-500/15 text-blue-400",
  },
  Design: { icon: Palette, classes: "bg-orange-500/15 text-orange-400" },
  Marketing: { icon: LineChart, classes: "bg-cyan-500/15 text-cyan-400" },
  Product: { icon: Briefcase, classes: "bg-teal-500/15 text-teal-400" },
  Sales: { icon: DollarSign, classes: "bg-indigo-500/15 text-indigo-400" },
  Other: { icon: PenTool, classes: "bg-violet-500/15 text-violet-400" },
};

function formatFrequency(frequency?: string) {
  if (!frequency) return "";
  return `/ ${frequency
    .replace(/^per\s+/i, "")
    .slice(0, 2)
    .toLowerCase()}`;
}

function formatSalary(job: Job) {
  if (job.minSalary == null && job.maxSalary == null) return "Not specified";
  const min = job.minSalary ?? "—";
  const max = job.maxSalary ?? "—";
  return `$${min} – $${max} ${formatFrequency(job.frequency)}`.trim();
}

function formatDeadline(deadline?: string) {
  if (!deadline) return "No deadline";
  const date = new Date(deadline);
  if (Number.isNaN(date.getTime())) return deadline;
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function toLines(text?: string) {
  if (!text?.trim()) return [];
  return text
    .split(/\r?\n/)
    .map((line) => line.replace(/^[-•*\s]+/, "").trim())
    .filter(Boolean);
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-zinc-950/50 p-3.5">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/10">
        <Icon className="size-4 text-violet-400" />
      </span>
      <div className="min-w-0">
        <p className="text-xs tracking-wider text-zinc-500 uppercase">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-medium break-words text-zinc-200">
          {value}
        </p>
      </div>
    </div>
  );
}

function SectionCard({
  icon: Icon,
  title,
  lines,
  fallback,
}: {
  icon: typeof Target;
  title: string;
  lines: string[];
  fallback: string;
}) {
  return (
    <section className="rounded-xl border border-white/10 bg-zinc-900/60 p-4 sm:p-6">
      <h2 className="flex items-center gap-2 text-sm font-semibold">
        <span className="flex size-7 items-center justify-center rounded-lg bg-violet-500/10">
          <Icon className="size-3.5 text-violet-400" />
        </span>
        {title}
      </h2>
      {lines.length > 0 ? (
        <ul className="mt-4 flex flex-col gap-2.5">
          {lines.map((line) => (
            <li
              key={line}
              className="flex items-start gap-2.5 text-sm text-zinc-300"
            >
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-400/80" />
              <span className="min-w-0 break-words">{line}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-zinc-500">{fallback}</p>
      )}
    </section>
  );
}

const JobDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  let job: Job | null = null;
  try {
    job = ((await getJobById(id)) as Job) ?? null;
  } catch {
    job = null;
  }

  if (!job || !job.jobTitle) notFound();

  const meta = CATEGORY_META[job.jobCategory] ?? CATEGORY_META.Other;
  const Icon = meta.icon;
  const responsibilities = toLines(job.responsibilities);
  const qualifications = toLines(job.qualifications);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 text-white sm:px-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/recruiter/manage-jobs">
              Manage Jobs
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Job Details</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3 sm:gap-4">
          <span
            className={`flex size-11 shrink-0 items-center justify-center rounded-xl sm:size-12 ${meta.classes}`}
          >
            <Icon className="size-5 sm:size-6" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
                <span className="size-1.5 rounded-full bg-emerald-400" />
                Active
              </span>
              <span className="rounded-full border border-white/10 bg-zinc-950/60 px-2.5 py-1 text-xs text-zinc-300">
                {job.jobType}
              </span>
              {job.remoteWork ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-1 text-xs text-violet-300">
                  <Globe className="size-3" />
                  Remote OK
                </span>
              ) : null}
            </div>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight break-words sm:text-3xl">
              {job.jobTitle}
            </h1>
            <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-400">
              <span className="inline-flex items-center gap-1.5">
                <Building2 className="size-3.5" />
                {job.companyName}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-3.5" />
                {job.jobLocation}
              </span>
              <span className="hidden sm:inline text-zinc-600">•</span>
              <span className="text-zinc-500">{job.jobCategory}</span>
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <Button
            render={
              <Link
                href="/dashboard/recruiter/manage-jobs"
                className="gap-1.5 border border-white/10 bg-zinc-900 px-3.5 text-zinc-300 hover:bg-zinc-800 hover:text-white"
              />
            }
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>
          <Button
            render={
              <Link
                href={`/dashboard/recruiter/manage-jobs/${id}`}
                className="gap-1.5 bg-violet-600 px-4 text-white hover:bg-violet-500"
              />
            }
          >
            <Pencil className="size-4" />
            Edit Job
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="rounded-xl border border-white/10 bg-zinc-900/60 p-4 sm:p-6">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <span className="flex size-7 items-center justify-center rounded-lg bg-violet-500/10">
                <Target className="size-3.5 text-violet-400" />
              </span>
              About This Role
            </h2>
            <p className="mt-4 text-sm leading-relaxed whitespace-pre-wrap text-zinc-300">
              {job.responsibilities?.trim()
                ? `We're hiring a ${job.jobTitle} at ${job.companyName}. Review the responsibilities and requirements below to see if this ${job.jobCategory} role is the right fit.`
                : `No additional description has been provided for this listing yet.`}
            </p>
          </div>

          <SectionCard
            icon={ListChecks}
            title="Key Responsibilities"
            lines={responsibilities}
            fallback="No responsibilities listed for this job yet."
          />

          <SectionCard
            icon={CheckCircle2}
            title="Qualifications & Requirements"
            lines={qualifications}
            fallback="No qualifications listed for this job yet."
          />
        </div>

        <aside className="flex flex-col gap-6 lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-xl border border-white/10 bg-zinc-900/60 p-4 sm:p-5">
            <h2 className="text-sm font-semibold">Job Overview</h2>
            <div className="mt-4 flex flex-col gap-3">
              <DetailRow
                icon={DollarSign}
                label="Compensation"
                value={formatSalary(job)}
              />
              <DetailRow
                icon={MapPin}
                label="Location"
                value={
                  job.remoteWork
                    ? `${job.jobLocation} · Hybrid/Remote`
                    : job.jobLocation
                }
              />
              <DetailRow
                icon={Briefcase}
                label="Employment Type"
                value={job.jobType}
              />
              <DetailRow
                icon={CalendarDays}
                label="Application Deadline"
                value={formatDeadline(job.applicationDeadline)}
              />
              <DetailRow
                icon={LineChart}
                label="Category"
                value={job.jobCategory}
              />
            </div>
          </div>

          <div className="rounded-xl border border-violet-500/20 bg-gradient-to-b from-violet-500/10 to-transparent p-4 sm:p-5">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Users className="size-4 text-violet-400" />
              Applicant Pipeline
            </div>
            <p className="mt-2 text-3xl font-semibold tracking-tight">—</p>
            <p className="mt-1 text-xs text-zinc-400">
              Applicant tracking for this listing will appear here once
              candidates start applying.
            </p>
            <Button
              render={
                <Link
                  href="/dashboard/recruiter/manage-jobs"
                  className="mt-4 w-full gap-1.5 border border-violet-500/30 bg-violet-500/10 text-violet-300 hover:bg-violet-500/20"
                />
              }
            >
              View All Listings
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default JobDetailPage;
