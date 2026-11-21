"use client";

import { useParams, useRouter } from "next/navigation";
import type React from "react";
import { toast } from "@/components/ui/toast";
import { applyToAJob } from "@/lib/actions/applications";
import { getApplcationsCount } from "@/lib/api/applications";
import { getJobById } from "@/lib/api/jobs";
import { getPremiumStatus } from "@/lib/api/payments";
import { useSession } from "@/lib/auth-client";

const FREE_APPLICATION_LIMIT = 5;

export function ApplyButton() {
  const router = useRouter();
  const params = useParams();

  const { data: session } = useSession();
  const user = session?.user;
  const handleApply = async (_event: React.MouseEvent<HTMLButtonElement>) => {
    _event.preventDefault();
    const job = await getJobById(params.id as string);
    if (!user) {
      router.push(`/sign-in?redirectTo=/browse-jobs/${job?._id}`);
    } else if (user.role === "seeker") {
      const { premium } = await getPremiumStatus(user.id as string);
      if (!premium) {
        const { count } = await getApplcationsCount(user.id);
        if (count >= FREE_APPLICATION_LIMIT) {
          toast.add({
            title: "Free applications limit reached",
            description: "Upgrade to a plan to keep applying.",
            type: "warning",
          });
          router.push("/payment");
          return;
        }
      }
      const application = {
        jobId: job?._id as string,
        applicantId: user.id as string,
        email: user.email as string,
        jobTitle: job?.jobTitle as string,
        companyName: job?.companyName as string,
        appliedAt: new Date().toISOString(),
      };
      const result = await applyToAJob(application);
      if (result.success) {
        toast.add({
          title: "Application submitted successfully",
          type: "success",
        });
        router.push("/browse-jobs");
      } else if (result.code === "FREE_LIMIT_REACHED") {
        toast.add({
          title: "Free applications limit reached",
          description: "Upgrade to a plan to keep applying.",
          type: "warning",
        });
        router.push("/payment");
      } else {
        toast.add({
          title: "Failed to submit application",
          type: "error",
        });
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleApply}
      className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-500"
    >
      Apply Now
    </button>
  );
}
