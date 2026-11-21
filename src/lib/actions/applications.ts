import type { Application } from "@/types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

type ApplicationInput = Omit<Application, "_id">;

export const applyToAJob = async (data: ApplicationInput) => {
  try {
    const res = await fetch(`${BASE_URL}/applications`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) return { success: false };
    const result = await res.json();
    return {
      success: Boolean(
        result?.acknowledged ?? result?.insertedId ?? result?.success,
      ),
    };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
};
