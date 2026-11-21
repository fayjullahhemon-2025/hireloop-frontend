import { Briefcase, Building2, CalendarDays, FileText } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getApplications } from "@/lib/api/applications";
import { auth } from "@/lib/auth";
import type { Application } from "@/types";

function formatAppliedDate(application: Application) {
  if (application.appliedAt) {
    const date = new Date(application.appliedAt);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  }
  if (application._id && application._id.length === 24) {
    const seconds = Number.parseInt(application._id.slice(0, 8), 16);
    if (!Number.isNaN(seconds)) {
      return new Date(seconds * 1000).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  }
  return "—";
}

const MyApplicationsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in?redirectTo=/dashboard/seeker/applications");
  }

  const applications =
    (await getApplications(`?applicantId=${session.user.id}`)) ?? [];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 text-white sm:px-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/seeker">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>My Applications</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          My Applications
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Every job you&apos;ve applied to, all in one place.
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="mt-6 flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-white/10 bg-zinc-900/60 px-6 py-14 text-center">
          <span className="flex size-10 items-center justify-center rounded-lg bg-white/5 text-zinc-500">
            <FileText className="size-5" />
          </span>
          <p className="text-sm font-medium text-zinc-200">
            No applications yet
          </p>
          <p className="text-xs text-zinc-500">
            Jobs you apply for will show up here.
          </p>
          <Link
            href="/browse-jobs"
            className="mt-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200"
          >
            Browse jobs
          </Link>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-xl border border-white/10 bg-zinc-900/60">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="px-4 py-3 text-xs tracking-wider text-zinc-500 uppercase">
                  Job Title
                </TableHead>
                <TableHead className="px-4 py-3 text-xs tracking-wider text-zinc-500 uppercase">
                  Company
                </TableHead>
                <TableHead className="px-4 py-3 text-xs tracking-wider text-zinc-500 uppercase">
                  Applied
                </TableHead>
                <TableHead className="px-4 py-3 text-right text-xs tracking-wider text-zinc-500 uppercase">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((application, index) => (
                <TableRow
                  key={application._id ?? `${application.jobId}-${index}`}
                  className="border-white/10 hover:bg-white/5"
                >
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/15 text-violet-400">
                        <Briefcase className="size-4" />
                      </span>
                      <p className="text-sm font-medium">
                        {application.jobTitle}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <p className="flex items-center gap-1.5 text-sm text-zinc-300">
                      <Building2 className="size-3.5 text-zinc-500" />
                      {application.companyName}
                    </p>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <p className="flex items-center gap-1.5 text-sm text-zinc-400">
                      <CalendarDays className="size-3.5 text-zinc-500" />
                      {formatAppliedDate(application)}
                    </p>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-right">
                    <Link
                      href={`/browse-jobs/${application.jobId}`}
                      className="rounded-lg border border-white/10 px-3 py-1.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
                    >
                      View Job
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default MyApplicationsPage;
