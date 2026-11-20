import { cn } from "cn";
import {
  Bookmark,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import SearchBar from "@/components/SearchBar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getJobs } from "@/lib/api/jobs";
import type { Job } from "@/types";
import { type FilterOption, JobFilters } from "./job-filters";
import {
  CATEGORY_META,
  FALLBACK_META,
  formatSalary,
  isHotJob,
  PILL_CLASSES,
} from "./shared";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const JOB_TYPE_FILTERS = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
] as const;

const SORT_OPTIONS = ["Most Recent", "Highest Salary", "Best Match"] as const;

function JobCard({ job }: { job: Job }) {
  const meta = CATEGORY_META[job.jobCategory] ?? FALLBACK_META;
  const Icon = meta.icon;
  const salary = formatSalary(job);
  const isHot = isHotJob(job);

  const content = (
    <>
      <span
        className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-lg",
          meta.classes,
        )}
      >
        <Icon className="size-5" />
      </span>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold text-white">
          {job.jobTitle}
        </h3>
        <p className="mt-1 truncate text-xs text-zinc-500">
          {job.companyName} • {job.jobLocation}
          {job.remoteWork ? " (Remote)" : ""}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {salary ? (
            <span className={PILL_CLASSES}>
              <DollarSign className="size-3 text-zinc-500" />
              {salary}
            </span>
          ) : null}
          <span className={PILL_CLASSES}>
            <Briefcase className="size-3 text-zinc-500" />
            {job.jobType}
          </span>
          {isHot ? (
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
    </>
  );

  return (
    <article className="relative rounded-xl border border-white/10 bg-zinc-900/60 p-4 transition-colors hover:border-white/20 hover:bg-zinc-900">
      {job._id ? (
        <Link
          href={`/browse-jobs/${job._id}`}
          className="flex gap-4 pr-7 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-white/30"
        >
          {content}
        </Link>
      ) : (
        <div className="flex gap-4 pr-7">{content}</div>
      )}
      <button
        type="button"
        aria-label="Save job"
        className="absolute right-4 top-4 rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-white/5 hover:text-zinc-300"
      >
        <Bookmark className="size-4" />
      </button>
    </article>
  );
}

async function BrowseJobsResults({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const readParam = (key: string) => {
    const value = params[key];
    return typeof value === "string" ? value.trim() : "";
  };
  const search = readParam("search");
  const selectedJobType = readParam("jobType") || "All";
  const selectedJobCategory = readParam("jobCategory") || "All";
  const query = search ? new URLSearchParams({ search }).toString() : "";
  const raw = await getJobs(query).catch(() => null);
  const allJobs: Job[] = Array.isArray(raw) ? raw : [];
  const jobs = allJobs.filter(
    (job) =>
      (selectedJobType === "All" || job.jobType === selectedJobType) &&
      (selectedJobCategory === "All" ||
        job.jobCategory === selectedJobCategory),
  );
  const categories = Array.from(
    new Set(
      allJobs
        .map((job) => job.jobCategory)
        .filter((category) => category.length > 0),
    ),
  ).sort((a, b) => a.localeCompare(b));
  const matchesCategory = (job: Job) =>
    selectedJobCategory === "All" || job.jobCategory === selectedJobCategory;
  const matchesType = (job: Job) =>
    selectedJobType === "All" || job.jobType === selectedJobType;
  const jobTypeOptions: FilterOption[] = [
    { value: "All", count: allJobs.filter(matchesCategory).length },
    ...JOB_TYPE_FILTERS.map((type) => ({
      value: type as string,
      count: allJobs.filter(
        (job) => matchesCategory(job) && job.jobType === type,
      ).length,
    })),
  ];
  const categoryOptions: FilterOption[] = [
    { value: "All", count: allJobs.filter(matchesType).length },
    ...categories.map((category) => ({
      value: category,
      count: allJobs.filter(
        (job) => matchesType(job) && job.jobCategory === category,
      ).length,
    })),
  ];
  if (!jobTypeOptions.some((option) => option.value === selectedJobType)) {
    jobTypeOptions.push({ value: selectedJobType, count: 0 });
  }
  if (!categoryOptions.some((option) => option.value === selectedJobCategory)) {
    categoryOptions.push({ value: selectedJobCategory, count: 0 });
  }

  return (
    <div className="mt-6 grid items-start gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="lg:sticky lg:top-8">
        <div className="rounded-xl border border-white/10 bg-zinc-900/60 p-5">
          <h2 className="text-base font-semibold tracking-tight">Filters</h2>
          <JobFilters
            jobTypes={jobTypeOptions}
            categories={categoryOptions}
            selectedJobType={selectedJobType}
            selectedJobCategory={selectedJobCategory}
          />
        </div>
      </aside>

      <section>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-lg font-semibold tracking-tight">
            Found {jobs.length} Professional Jobs
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">Sort by:</span>
            <Select defaultValue={SORT_OPTIONS[0]}>
              <SelectTrigger className="w-40 border-white/10 bg-zinc-900/60 text-zinc-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-zinc-900 text-zinc-100">
                {SORT_OPTIONS.map((option) => (
                  <SelectItem
                    key={option}
                    value={option}
                    className="text-zinc-300 focus:bg-white/10 focus:text-white"
                  >
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-4">
          {jobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-white/10 bg-zinc-900/60 px-6 py-14 text-center">
              <span className="flex size-10 items-center justify-center rounded-lg bg-white/5 text-zinc-500">
                <Briefcase className="size-5" />
              </span>
              <p className="text-sm font-medium text-zinc-200">No jobs found</p>
              <p className="text-xs text-zinc-500">
                Try a different keyword or check back later for new
                opportunities.
              </p>
            </div>
          ) : (
            jobs.map((job, index) => (
              <JobCard key={job._id ?? `${job.jobTitle}-${index}`} job={job} />
            ))
          )}
        </div>

        {jobs.length > 0 ? (
          <nav
            aria-label="Pagination"
            className="mt-8 flex items-center justify-center gap-1.5"
          >
            <button
              type="button"
              aria-label="Previous page"
              className="flex size-8 items-center justify-center rounded-lg border border-white/10 text-zinc-500 transition-colors hover:bg-white/5 hover:text-zinc-300"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              aria-current="page"
              className="flex size-8 items-center justify-center rounded-lg bg-white text-xs font-semibold text-zinc-950"
            >
              1
            </button>
            <button
              type="button"
              className="flex size-8 items-center justify-center rounded-lg text-xs font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              2
            </button>
            <button
              type="button"
              className="flex size-8 items-center justify-center rounded-lg text-xs font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              3
            </button>
            <span className="px-1 text-xs text-zinc-600">…</span>
            <button
              type="button"
              className="flex size-8 items-center justify-center rounded-lg text-xs font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              42
            </button>
            <button
              type="button"
              aria-label="Next page"
              className="flex size-8 items-center justify-center rounded-lg border border-white/10 text-zinc-500 transition-colors hover:bg-white/5 hover:text-zinc-300"
            >
              <ChevronRight className="size-4" />
            </button>
          </nav>
        ) : null}
      </section>
    </div>
  );
}

function SearchBarFallback() {
  return (
    <div
      aria-hidden
      className="h-[54px] rounded-xl border border-white/10 bg-zinc-900/60"
    />
  );
}

function BrowseJobsSkeleton() {
  return (
    <div
      aria-hidden
      className="mt-6 grid animate-pulse items-start gap-6 lg:grid-cols-[240px_minmax(0,1fr)]"
    >
      <div className="h-72 rounded-xl border border-white/10 bg-zinc-900/60" />
      <div className="flex flex-col gap-4">
        <div className="h-6 w-56 rounded-md bg-white/5" />
        <div className="h-28 rounded-xl border border-white/10 bg-zinc-900/60" />
        <div className="h-28 rounded-xl border border-white/10 bg-zinc-900/60" />
        <div className="h-28 rounded-xl border border-white/10 bg-zinc-900/60" />
      </div>
    </div>
  );
}

const BrowseJobsPage = ({ searchParams }: { searchParams: SearchParams }) => {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
        <Suspense fallback={<SearchBarFallback />}>
          <SearchBar />
        </Suspense>
        <Suspense fallback={<BrowseJobsSkeleton />}>
          <BrowseJobsResults searchParams={searchParams} />
        </Suspense>
      </main>
    </div>
  );
};

export default BrowseJobsPage;
