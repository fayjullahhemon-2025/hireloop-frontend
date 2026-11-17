"use client";

import { Building2, Globe, Sparkles } from "lucide-react";
import { useState } from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { createJobs } from "@/lib/actions/jobs";

const jobTypes = ["Full-time", "Part-time", "Contract", "Internship"] as const;

const jobCategories = [
    "Engineering & Tech",
    "Design",
    "Marketing",
    "Product",
    "Sales",
    "Other",
] as const;

const salaryFrequencies = [
    "per hour",
    "per day",
    "per month",
    "per year",
] as const;
export interface JobFormData {
    jobTitle: string;
    companyName: string;
    jobCategory: string;
    jobType: string;
    remoteWork: boolean;
    jobLocation: string;
    applicationDeadline: string;
    minSalary: number;
    maxSalary: number;
    frequency: string;
    responsibilities: string;
    qualifications: string;
}
export default function AddJobsPage() {
    const [jobType, setJobType] = useState<string>("Full-time");
    const [jobCategory, setJobCategory] = useState<string>("");
    const [frequency, setFrequency] = useState<string>("per hour");
    const [remoteWork, setRemoteWork] = useState(false);
    const [pending, setPending] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setPending(true);

        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries());
        console.log(data);
        // const payload = {
        //     jobTitle: formData.get("jobTitle") as string,
        //     companyName: formData.get("companyName") as string,
        //     jobCategory: formData.get("jobCategory") as string,
        //     jobType: formData.get("jobType") as string,
        //     remoteWork: formData.get("remoteWork") === "on",
        //     jobLocation: formData.get("jobLocation") as string,
        //     applicationDeadline: formData.get("applicationDeadline") as string,
        //     minSalary: Number(formData.get("minSalary")),
        //     maxSalary: Number(formData.get("maxSalary")),
        //     frequency: formData.get("frequency") as string,
        //     responsibilities: formData.get("responsibilities") as string,
        //     qualifications: formData.get("qualifications") as string,
        // };


        // console.log(payload);
        setPending(false);
        const result = await createJobs(data as unknown as JobFormData)
        console.log(result)
    }

    return (
        <div className="mx-auto w-full max-w-4xl px-4 py-8 text-white sm:px-6">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard/recruiter">
                            Manage Jobs
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Create New Listing</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight">
                        Post a New Job
                    </h1>
                    <p className="mt-1 text-sm text-zinc-400">
                        Fill in the position specifications to attract qualified talent
                        across our network.
                    </p>
                </div>
                <Button
                    type="submit"
                    form="post-job"
                    disabled={pending}
                    className="w-fit shrink-0 bg-violet-600 px-5 text-white hover:bg-violet-500"
                >
                    Publish Job
                    <span aria-hidden>&rarr;</span>
                </Button>
            </div>

            <form
                id="post-job"
                onSubmit={handleSubmit}
                className="mt-8 flex flex-col gap-6"
            >
                <section className="rounded-xl border border-white/10 bg-zinc-900/60 p-4 sm:p-6">
                    <h2 className="flex items-center gap-2 text-sm font-semibold">
                        <Sparkles className="size-4 text-violet-500" />
                        1. Basic Information
                    </h2>

                    <div className="mt-5 flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="jobTitle">
                                Job Title <span className="text-violet-400">*</span>
                            </Label>
                            <Textarea
                                id="jobTitle"
                                name="jobTitle"
                                placeholder="Frontend Developer"
                                required
                                className="min-h-16 bg-zinc-950/60 border-white/10 placeholder:text-zinc-500"
                            />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="companyName">
                                    Company Name <span className="text-violet-400">*</span>
                                </Label>
                                <div className="relative">
                                    <Building2 className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-zinc-500" />
                                    <Input
                                        id="companyName"
                                        name="companyName"
                                        placeholder="HireLoop Network"
                                        required
                                        className="bg-zinc-950/60 border-white/10 pl-8 placeholder:text-zinc-500"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label>
                                    Job Category <span className="text-violet-400">*</span>
                                </Label>
                                <Select
                                    name="jobCategory"
                                    value={jobCategory}
                                    onValueChange={(value) => setJobCategory(value ?? "")}
                                >
                                    <SelectTrigger className="w-full bg-zinc-950/60 border-white/10 data-placeholder:text-zinc-500">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {jobCategories.map((category) => (
                                            <SelectItem key={category} value={category}>
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label>
                                Job Type <span className="text-violet-400">*</span>
                            </Label>
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                {jobTypes.map((type) => (
                                    <label
                                        key={type}
                                        className="flex cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-zinc-950/60 px-3 py-2.5 text-sm text-zinc-400 transition-colors has-checked:border-violet-500 has-checked:bg-violet-500/10 has-checked:text-white"
                                    >
                                        <input
                                            type="radio"
                                            name="jobType"
                                            value={type}
                                            checked={jobType === type}
                                            onChange={(event) => setJobType(event.target.value)}
                                            className="sr-only"
                                        />
                                        {type}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="rounded-xl border border-white/10 bg-zinc-900/60 p-4 sm:p-6">
                    <h2 className="flex items-center gap-2 text-sm font-semibold">
                        <span className="size-2 rounded-[2px] bg-violet-500" />
                        2. Location, Compensation &amp; Timeline
                    </h2>

                    <div className="mt-5 flex flex-col gap-4">
                        <div className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-zinc-950/60 p-4">
                            <div className="flex items-center gap-3">
                                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/10">
                                    <Globe className="size-4 text-violet-400" />
                                </span>
                                <div>
                                    <p className="text-sm font-medium">
                                        Remote Work Allowed (Optional)
                                    </p>
                                    <p className="text-xs text-zinc-500">
                                        Enable if work can be performed outside office-locations
                                    </p>
                                </div>
                            </div>
                            <Switch
                                name="remoteWork"
                                checked={remoteWork}
                                onCheckedChange={setRemoteWork}
                                className="data-checked:bg-violet-600 data-unchecked:bg-zinc-700"
                            />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="jobLocation">
                                        Job Location <span className="text-violet-400">*</span>
                                    </Label>
                                    <span className="text-xs text-zinc-500">Required</span>
                                </div>
                                <Input
                                    id="jobLocation"
                                    name="jobLocation"
                                    placeholder="New York, USA"
                                    required
                                    className="bg-zinc-950/60 border-white/10 placeholder:text-zinc-500"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="applicationDeadline">
                                    Application Deadline (deadline)
                                </Label>
                                <Input
                                    id="applicationDeadline"
                                    name="applicationDeadline"
                                    type="date"
                                    className="bg-zinc-950/60 border-white/10 text-zinc-400"
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="minSalary">Min Salary / Rate</Label>
                                <Input
                                    id="minSalary"
                                    name="minSalary"
                                    type="number"
                                    min={0}
                                    placeholder="25"
                                    className="bg-zinc-950/60 border-white/10 placeholder:text-zinc-500"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="maxSalary">Max Salary / Rate</Label>
                                <Input
                                    id="maxSalary"
                                    name="maxSalary"
                                    type="number"
                                    min={0}
                                    placeholder="40"
                                    className="bg-zinc-950/60 border-white/10 placeholder:text-zinc-500"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label>Frequency</Label>
                                <Select
                                    name="frequency"
                                    value={frequency}
                                    onValueChange={(value) => setFrequency(value ?? "per hour")}
                                >
                                    <SelectTrigger className="w-full bg-zinc-950/60 border-white/10 data-placeholder:text-zinc-500">
                                        <SelectValue placeholder="Select frequency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {salaryFrequencies.map((freq) => (
                                            <SelectItem key={freq} value={freq}>
                                                {freq}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="rounded-xl border border-white/10 bg-zinc-900/60 p-4 sm:p-6">
                    <h2 className="flex items-center gap-2 text-sm font-semibold">
                        <span className="size-2 rounded-[2px] bg-violet-500" />
                        3. Responsibilities &amp; Requirements
                    </h2>

                    <div className="mt-5 flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="responsibilities">
                                Key Responsibilities <span className="text-violet-400">*</span>
                            </Label>
                            <Textarea
                                id="responsibilities"
                                name="responsibilities"
                                placeholder="Showcase your commitment to delivering exceptional user interfaces and digital experiences..."
                                required
                                className="min-h-24 bg-zinc-950/60 border-white/10 placeholder:text-zinc-500"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="qualifications">
                                Qualifications &amp; Requirements{" "}
                                <span className="text-violet-400">*</span>
                            </Label>
                            <Textarea
                                id="qualifications"
                                name="qualifications"
                                placeholder={
                                    "3+ years of experience with React, TypeScript...\nSolid understanding of DOM performance..."
                                }
                                required
                                className="min-h-28 bg-zinc-950/60 border-white/10 placeholder:text-zinc-500"
                            />
                        </div>
                    </div>
                </section>
            </form>
        </div>
    );
}
