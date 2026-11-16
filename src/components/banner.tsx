import {
  Briefcase,
  Building2,
  MapPin,
  Search,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import Image from "next/image";

const trendingTags = [
  "Tracing Factors",
  "Web designer",
  "Adminsupport",
  "Ops engineer",
];

const stats = [
  { icon: Briefcase, value: "50K", label: "Active Jobs" },
  { icon: Building2, value: "12K", label: "Companies" },
  { icon: Users, value: "2M", label: "Job Seekers" },
  { icon: TrendingUp, value: "97%", label: "Satisfaction Rate" },
];

export function Banner() {
  return (
    <section className="relative overflow-hidden bg-zinc-950 text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[600px] bg-[radial-gradient(60%_50%_at_50%_0%,rgba(124,58,237,0.25),transparent_70%)]" />

      <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-0 sm:px-6 sm:pt-20 lg:px-8">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide text-zinc-300 uppercase">
            <Sparkles className="size-3.5 text-violet-400" />
            $4,994+ new jobs this month
          </span>

          <h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            Find Your Dream Job Today
          </h1>

          <p className="mt-4 max-w-xl text-sm text-zinc-400 sm:text-base">
            HireLoop connects you to top remote campaigns, browse thousands of
            curated opportunities and let your next role — faster
          </p>

          <form
            action="#search"
            className="mt-8 flex w-full max-w-2xl flex-col gap-2 rounded-xl border border-white/10 bg-zinc-900/80 p-2 sm:flex-row sm:items-center"
          >
            <div className="flex flex-1 items-center gap-2 px-3 py-2">
              <Search className="size-4 shrink-0 text-zinc-500" />
              <input
                type="text"
                placeholder="Job title or company"
                className="w-full bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
              />
            </div>
            <div className="hidden h-6 w-px bg-white/10 sm:block" />
            <div className="flex flex-1 items-center gap-2 px-3 py-2 sm:max-w-[180px]">
              <MapPin className="size-4 shrink-0 text-zinc-500" />
              <input
                type="text"
                placeholder="Location"
                className="w-full bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              aria-label="Search jobs"
              className="flex items-center justify-center rounded-lg bg-violet-600 px-5 py-2.5 transition-colors hover:bg-violet-500"
            >
              <Search className="size-4 text-white" />
            </button>
          </form>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {trendingTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="relative mt-14 sm:mt-20">
        <div className="relative h-[320px] w-full overflow-hidden sm:h-[420px] lg:h-[500px]">
          <Image
            src="/images/globe.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-[50%_62%]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-transparent to-transparent" />
          <p className="absolute inset-x-0 top-[42%] mx-auto max-w-md -translate-y-1/2 px-4 text-center text-lg font-semibold text-white sm:max-w-lg sm:text-2xl">
            Assisting over 15,000 job seekers
            <br />
            find their dream positions.
          </p>
        </div>

        <div className="relative z-10 mx-auto -mt-12 max-w-7xl px-2 sm:-mt-20 sm:px-4">
          <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border border-white/10 bg-zinc-950/90 p-4 sm:p-5"
              >
                <stat.icon className="size-4 text-zinc-300" />
                <p className="mt-5 text-2xl font-semibold sm:text-3xl lg:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-[11px] text-zinc-400 sm:text-xs">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
