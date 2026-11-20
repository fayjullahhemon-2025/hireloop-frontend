import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  Code2,
  Database,
  DollarSign,
  LineChart,
  Palette,
} from "lucide-react";
import type { Job } from "@/types";

export const CATEGORY_META: Record<
  string,
  { icon: LucideIcon; classes: string }
> = {
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

export const FALLBACK_META = {
  icon: Briefcase,
  classes: "bg-violet-500/15 text-violet-400",
};

export const PILL_CLASSES =
  "inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-zinc-300";

export function formatSalary(job: Job) {
  if (job.minSalary == null && job.maxSalary == null) return null;
  const part = (value?: number) => {
    if (value == null) return "—";
    return value >= 1000 ? `$${Math.round(value / 1000)}K` : `$${value}`;
  };
  return `${part(job.minSalary)} - ${part(job.maxSalary)}`;
}

export function isHotJob(job: Job) {
  return (job.applicantCount ?? 0) >= 50;
}
