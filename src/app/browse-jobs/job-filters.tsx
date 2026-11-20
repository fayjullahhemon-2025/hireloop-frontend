"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export type FilterOption = {
  value: string;
  count: number;
};

type JobFiltersProps = {
  jobTypes: FilterOption[];
  categories: FilterOption[];
  selectedJobType: string;
  selectedJobCategory: string;
};

function FilterRadioRow({ label, count }: { label: string; count: number }) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: RadioGroupItem renders a native input inside the label
    <label className="group flex cursor-pointer items-center justify-between gap-3">
      <span className="flex items-center gap-2.5">
        <RadioGroupItem
          value={label}
          aria-label={label}
          className="border-zinc-600 data-checked:border-white"
        />
        <span className="text-sm text-zinc-500 transition-colors group-has-[[data-checked]]:text-zinc-100">
          {label}
        </span>
      </span>
      <span className="text-xs tabular-nums text-zinc-600">{count}</span>
    </label>
  );
}

export function JobFilters({
  jobTypes,
  categories,
  selectedJobType,
  selectedJobCategory,
}: JobFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [jobType, setJobType] = useState(selectedJobType);
  const [jobCategory, setJobCategory] = useState(selectedJobCategory);

  useEffect(() => {
    setJobType(selectedJobType);
  }, [selectedJobType]);
  useEffect(() => {
    setJobCategory(selectedJobCategory);
  }, [selectedJobCategory]);

  const handleFilterSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (jobType !== "All") {
      params.set("jobType", jobType);
    } else {
      params.delete("jobType");
    }
    if (jobCategory !== "All") {
      params.set("jobCategory", jobCategory);
    } else {
      params.delete("jobCategory");
    }
    const query = params.toString();
    router.push(query ? `/browse-jobs?${query}` : "/browse-jobs");
  };

  return (
    <form onSubmit={handleFilterSubmit}>
      <div className="mt-5">
        <p className="text-sm font-medium text-zinc-300">Job Type</p>
        <RadioGroup
          name="jobType"
          aria-label="Job Type"
          value={jobType}
          onValueChange={(value) => setJobType(value ?? "All")}
          className="mt-3 flex flex-col gap-3"
        >
          {jobTypes.map((option) => (
            <FilterRadioRow
              key={option.value}
              label={option.value}
              count={option.count}
            />
          ))}
        </RadioGroup>
      </div>
      <div className="mt-6">
        <p className="text-sm font-medium text-zinc-300">Job Category</p>
        <RadioGroup
          name="jobCategory"
          aria-label="Job Category"
          value={jobCategory}
          onValueChange={(value) => setJobCategory(value ?? "All")}
          className="mt-3 flex flex-col gap-3"
        >
          {categories.map((option) => (
            <FilterRadioRow
              key={option.value}
              label={option.value}
              count={option.count}
            />
          ))}
        </RadioGroup>
      </div>
      <button
        type="submit"
        className="mt-6 w-full rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-500"
      >
        Apply Filters
      </button>
    </form>
  );
}
