import type { JobFormData } from "@/types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export const createJobs = async (data: JobFormData) => {
  const res = await fetch(`${BASE_URL}/jobs`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  return result;
};

export const deleteJobs = async (id: string) => {
  const res = await fetch(`${BASE_URL}/jobs/${id}`, { method: "DELETE" });
  return res.json();
};
