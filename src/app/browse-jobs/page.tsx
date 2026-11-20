import { cn } from "cn";
import type { LucideIcon } from "lucide-react";
import {
  Bookmark,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Code2,
  Database,
  DollarSign,
  LineChart,
  Palette,
  Zap,
} from "lucide-react";
import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import SearchBar from "@/components/SearchBar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getJobs } from "@/lib/api/jobs";
import type { Job } from "@/types";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const JOB_TYPE_FILTERS = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
] as const;

const SORT_OPTIONS = ["Most Recent", "Highest Salary", "Best Match"] as const;

const CATEGORY_META: Record<string, { icon: LucideIcon; classes: string }> = {
  Engineering: { icon: Code2, classes: "bg-blue-500/15 text-blue-400" },
  "Engineering & Tech": {
    icon: Code2,
    classes: "bg-blue-500/15 text-blue-400",
  },
  Design: { icon: Palette, classes: "bg-orange-500/15 text-orange-400" },
  Data: { icon: Database, classes: "bg-emerald-500/15 text-emerald-400" },
  Marketing: { icon: LineChart, classes: "bg-cyan-500/15 text-cyan-400" },
  Product: { icon: Briefcase, classes: "bg-teal-500/15 text-teal-400" },
  Sales: { icon: DollarSign, classes: "bg-indigo-500/15 text-indigo-400" },
};

const FALLBACK_META = {
  icon: Briefcase,
  classes: "bg-violet-500/15 text-violet-400",
};

function formatSalary(job: Job) {
  if (job.minSalary == null && job.maxSalary == null) return null;
  const part = (value?: number) => {
    if (value == null) return "—";
    return value >= 1000 ? `$${Math.round(value / 1000)}K` : `$${value}`;
  };
  return `${part(job.minSalary)} - ${part(job.maxSalary)}`;
}

const PILL_CLASSES =
  "inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-zinc-300";

function JobCard({ job }: { job: Job }) {
  const meta = CATEGORY_META[job.jobCategory] ?? FALLBACK_META;
  const Icon = meta.icon;
  const salary = formatSalary(job);
  const isHot = (job.applicantCount ?? 0) >= 50;

  return (
    <article className="rounded-xl border border-white/10 bg-zinc-900/60 p-4 transition-colors hover:border-white/20 hover:bg-zinc-900">
      <div className="flex gap-4">
        <span
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-lg",
            meta.classes,
          )}
        >
          <Icon className="size-5" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-white">
                {job.jobTitle}
              </h3>
              <p className="mt-1 truncate text-xs text-zinc-500">
                {job.companyName} • {job.jobLocation}
                {job.remoteWork ? " (Remote)" : ""}
              </p>
            </div>
            <button
              type="button"
              aria-label="Save job"
              className="-m-1.5 shrink-0 rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-white/5 hover:text-zinc-300"
            >
              <Bookmark className="size-4" />
            </button>
          </div>

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
      </div>
    </article>
  );
}

async function BrowseJobsResults({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search.trim() : "";
  const query = search ? new URLSearchParams({ search }).toString() : "";
  const raw = await getJobs(query).catch(() => null);
  const jobs: Job[] = Array.isArray(raw) ? raw : [];

  return (
    <div className="mt-6 grid items-start gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="lg:sticky lg:top-8">
        <div className="rounded-xl border border-white/10 bg-zinc-900/60 p-5">
          <h2 className="text-base font-semibold tracking-tight">Filters</h2>
          <div className="mt-5">
            <p className="text-sm font-medium text-zinc-300">Job Type</p>
            <ul className="mt-3 flex flex-col gap-3">
              {JOB_TYPE_FILTERS.map((type) => {
                const count = jobs.filter((job) => job.jobType === type).length;
                return (
                  <li key={type}>
                    {/* biome-ignore lint/a11y/noLabelWithoutControl: Checkbox renders a Base UI control inside the label */}
                    <label className="group flex cursor-pointer items-center justify-between gap-3">
                      <span className="flex items-center gap-2.5">
                        <Checkbox
                          defaultChecked={type === "Full-time"}
                          aria-label={type}
                          className="border-zinc-600 bg-zinc-950 data-checked:border-white data-checked:bg-white data-checked:text-zinc-950"
                        />
                        <span className="text-sm text-zinc-500 transition-colors group-has-[[data-checked]]:text-zinc-100">
                          {type}
                        </span>
                      </span>
                      <span className="text-xs tabular-nums text-zinc-600">
                        {count}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
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
