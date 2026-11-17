import {
  Briefcase,
  Code2,
  DollarSign,
  LineChart,
  MapPin,
  Palette,
  PenTool,
  Users,
} from "lucide-react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getJobs } from "@/lib/api/jobs";
import { JobActions } from "./job-actions";

interface Job {
  _id?: string;
  jobTitle: string;
  companyName: string;
  jobCategory: string;
  jobType: string;
  remoteWork?: boolean;
  jobLocation: string;
  applicationDeadline?: string;
  minSalary?: number;
  maxSalary?: number;
  frequency?: string;
}

const HARDCODED_APPLICANTS = [34, 18, 12, 27, 8, 21, 45, 9];
const HARDCODED_STATUS = ["Active", "Active", "Active", "Active", "Expired"];

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

function formatDeadline(deadline?: string) {
  if (!deadline) return "—";
  const date = new Date(deadline);
  if (Number.isNaN(date.getTime())) return deadline;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const ManageJobsPage = async () => {
  const jobs = (await getJobs()) as Job[];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 text-white sm:px-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/recruiter">
              Manage Jobs
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Job Listings &amp; Postings</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Manage Job Posts
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Review live listings, monitor applicants, and update job details
            across your organization.
          </p>
        </div>
        <Button
          render={
            <Link
              href="/dashboard/recruiter/add-jobs"
              className="flex w-fit shrink-0 items-center gap-1 rounded-lg bg-violet-600 px-5 py-2 text-sm font-medium text-white hover:bg-violet-500"
            />
          }
        >
          <span aria-hidden>+</span> New Job Post
        </Button>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-white/10 bg-zinc-900/60">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="px-4 py-3 text-xs tracking-wider text-zinc-500 uppercase">
                Job Title &amp; Dept
              </TableHead>
              <TableHead className="px-4 py-3 text-xs tracking-wider text-zinc-500 uppercase">
                Company &amp; Location
              </TableHead>
              <TableHead className="px-4 py-3 text-xs tracking-wider text-zinc-500 uppercase">
                Type
              </TableHead>
              <TableHead className="px-4 py-3 text-xs tracking-wider text-zinc-500 uppercase">
                Compensation
              </TableHead>
              <TableHead className="px-4 py-3 text-xs tracking-wider text-zinc-500 uppercase">
                Applicants
              </TableHead>
              <TableHead className="px-4 py-3 text-xs tracking-wider text-zinc-500 uppercase">
                Status
              </TableHead>
              <TableHead className="px-4 py-3 text-xs tracking-wider text-zinc-500 uppercase">
                Deadline
              </TableHead>
              <TableHead className="px-4 py-3 text-right text-xs tracking-wider text-zinc-500 uppercase">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job, index) => {
              const meta =
                CATEGORY_META[job.jobCategory] ?? CATEGORY_META.Other;
              const Icon = meta.icon;
              const status = HARDCODED_STATUS[index % HARDCODED_STATUS.length];
              const applicants =
                HARDCODED_APPLICANTS[index % HARDCODED_APPLICANTS.length];
              return (
                <TableRow
                  key={job._id ?? `${job.jobTitle}-${index}`}
                  className="border-white/10 hover:bg-white/5"
                >
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${meta.classes}`}
                      >
                        <Icon className="size-4" />
                      </span>
                      <div>
                        <p className="text-sm font-medium">{job.jobTitle}</p>
                        <p className="text-xs text-zinc-500">
                          {job.jobCategory}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <p className="text-sm">{job.companyName}</p>
                    <p className="flex items-center gap-1 text-xs text-zinc-500">
                      <MapPin className="size-3" />
                      {job.jobLocation}
                      {job.remoteWork ? " (Hybrid)" : ""}
                    </p>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <span className="rounded-full border border-white/10 bg-zinc-950/60 px-2.5 py-1 text-xs text-zinc-300">
                      {job.jobType}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-zinc-300">
                    ${job.minSalary ?? "—"} - ${job.maxSalary ?? "—"}{" "}
                    {formatFrequency(job.frequency)}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <span className="flex items-center gap-1.5 text-sm font-medium text-violet-400">
                      <Users className="size-4" />
                      {applicants} Candidates
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                        status === "Active"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-zinc-500/10 text-zinc-400"
                      }`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${
                          status === "Active" ? "bg-emerald-400" : "bg-zinc-500"
                        }`}
                      />
                      {status}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <p className="text-sm">
                      {formatDeadline(job.applicationDeadline)}
                    </p>
                    <p className="text-xs text-zinc-500">Posted 3w ago</p>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <JobActions />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ManageJobsPage;
