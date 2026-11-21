import type { Application } from "@/types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

//get applications, optionally filtered with a query string like `?applicantId=...`
export const getApplications = async (
  query = "",
): Promise<Application[] | undefined> => {
  try {
    const qs = query ? (query.startsWith("?") ? query : `?${query}`) : "";
    const response = await fetch(`${BASE_URL}/applications${qs}`, {
      cache: "no-store",
    });
    if (!response.ok) return undefined;
    return (await response.json()) as Application[];
  } catch (err) {
    console.log(err);
    return undefined;
  }
};

export const getApplcationsCount = async (
  applicantId: string,
): Promise<{ count: number }> => {
  try {
    const res = await fetch(
      `${BASE_URL}/applications/count?applicantId=${encodeURIComponent(applicantId)}`,
      { cache: "no-store" },
    );
    if (!res.ok) return { count: 0 };
    const data = await res.json();
    return { count: data?.count ?? 0 };
  } catch (err) {
    console.log(err);
    return { count: 0 };
  }
};
