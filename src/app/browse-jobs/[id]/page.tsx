import { cn } from "cn";
import {
  Bookmark,
  Briefcase,
  CalendarDays,
  ChevronLeft,
  DollarSign,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { getJobById } from "@/lib/api/jobs";
import type { Job } from "@/types";
import {
  CATEGORY_META,
  FALLBACK_META,
  formatSalary,
  isHotJob,
  PILL_CLASSES,
} from "../shared";

type PageProps = {
  params: Promise<{ id: string }>;
};

function formatDeadline(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function JobNotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-white/10 bg-zinc-900/60 px-6 py-14 text-center">
      <span className="flex size-10 items-center justify-center rounded-lg bg-white/5 text-zinc-500">
        <Briefcase className="size-5" />
      </span>
      <p className="text-sm font-medium text-zinc-200">Job not found</p>
      <p className="text-xs text-zinc-500">
        This job may have been removed or the link is invalid.
      </p>
      <Link
        href="/browse-jobs"
        className="mt-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200"
      >
        Back to jobs
      </Link>
    </div>
  );
}

function JobDetailSkeleton() {
  return (
    <div aria-hidden className="flex animate-pulse flex-col gap-6">
      <div className="h-5 w-28 rounded-md bg-white/5" />
      <div className="rounded-xl border border-white/10 bg-zinc-900/60 p-6">
        <div className="flex gap-4">
          <div className="size-14 rounded-lg bg-white/5" />
          <div className="flex-1 space-y-3">
            <div className="h-6 w-2/3 rounded-md bg-white/5" />
            <div className="h-4 w-1/3 rounded-md bg-white/5" />
            <div className="h-8 w-1/2 rounded-md bg-white/5" />
          </div>
        </div>
      </div>
      <div className="h-44 rounded-xl border border-white/10 bg-zinc-900/60" />
    </div>
  );
}

async function JobDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const raw: unknown = await getJobById(id).catch(() => null);
  const job =
    raw && typeof raw === "object" && "_id" in raw ? (raw as Job) : null;
  if (!job) return <JobNotFound />;

  const meta = CATEGORY_META[job.jobCategory] ?? FALLBACK_META;
  const Icon = meta.icon;
  const salary = formatSalary(job);
  const deadline = formatDeadline(job.applicationDeadline);
  const hot = isHotJob(job);
  const applicants = job.applicantCount ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/browse-jobs"
        className="inline-flex w-fit items-center gap-1.5 rounded-md text-sm text-zinc-400 transition-colors outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-white/30"
      >
        <ChevronLeft className="size-4" />
        Back to jobs
      </Link>

      <article className="rounded-xl border border-white/10 bg-zinc-900/60 p-6">
        <div className="flex gap-4">
          <span
            className={cn(
              "flex size-14 shrink-0 items-center justify-center rounded-lg",
              meta.classes,
            )}
          >
            <Icon className="size-7" />
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h1 className="text-xl font-semibold tracking-tight">
                  {job.jobTitle}
                </h1>
                <p className="mt-1 text-sm text-zinc-500">
                  {job.companyName} • {job.jobLocation}
                  {job.remoteWork ? " (Remote)" : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {hot ? (
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-500/15 px-2.5 py-1 text-xs font-medium text-amber-400">
                    <Zap className="size-3" />
                    Hot Job
                  </span>
                ) : null}
                {job.status === "expired" ? (
                  <span className="inline-flex items-center rounded-md bg-rose-500/15 px-2.5 py-1 text-xs font-medium text-rose-400">
                    Closed
                  </span>
                ) : null}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className={PILL_CLASSES}>
                <Briefcase className="size-3 text-zinc-500" />
                {job.jobType}
              </span>
              {salary ? (
                <span className={PILL_CLASSES}>
                  <DollarSign className="size-3 text-zinc-500" />
                  {salary}
                  {job.frequency ? (
                    <span className="text-zinc-500">/ {job.frequency}</span>
                  ) : null}
                </span>
              ) : null}
              <span className={PILL_CLASSES}>
                <Icon className="size-3 text-zinc-500" />
                {job.jobCategory}
              </span>
              {deadline ? (
                <span className={PILL_CLASSES}>
                  <CalendarDays className="size-3 text-zinc-500" />
                  Apply by {deadline}
                </span>
              ) : null}
              {applicants > 0 ? (
                <span className={PILL_CLASSES}>
                  <Users className="size-3 text-zinc-500" />
                  {applicants} {applicants === 1 ? "applicant" : "applicants"}
                </span>
              ) : null}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-500"
              >
                Apply Now
              </button>
              <button
                type="button"
                aria-label="Save job"
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                <Bookmark className="size-4" />
                Save
              </button>
            </div>
          </div>
        </div>
      </article>

      <section className="rounded-xl border border-white/10 bg-zinc-900/60 p-6">
        <h2 className="text-base font-semibold tracking-tight">
          Job Description
        </h2>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-zinc-400">
          {job.responsibilities?.trim() || "No description provided."}
        </p>
      </section>

      {job.qualifications?.trim() ? (
        <section className="rounded-xl border border-white/10 bg-zinc-900/60 p-6">
          <h2 className="text-base font-semibold tracking-tight">
            Qualifications
          </h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-zinc-400">
            {job.qualifications}
          </p>
        </section>
      ) : null}
    </div>
  );
}

const JobDetailPage = ({ params }: PageProps) => {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
        <Suspense fallback={<JobDetailSkeleton />}>
          <JobDetail params={params} />
        </Suspense>
      </main>
    </div>
  );
};

export default JobDetailPage;
