const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export interface PremiumStatus {
  userId?: string;
  premium: boolean;
  freeApplicationLimit?: number | null;
}

export const getPremiumStatus = async (
  userId: string,
): Promise<PremiumStatus> => {
  try {
    const res = await fetch(
      `${BASE_URL}/users/${encodeURIComponent(userId)}/premium`,
      { cache: "no-store" },
    );
    if (!res.ok) return { premium: false };
    const data = (await res.json()) as PremiumStatus;
    return {
      premium: Boolean(data?.premium),
      userId: data?.userId,
      freeApplicationLimit: data?.freeApplicationLimit,
    };
  } catch (err) {
    console.log(err);
    return { premium: false };
  }
};

export interface VerifyPaymentResult {
  success: boolean;
  alreadyProcessed?: boolean;
  payment?: {
    sessionId: string;
    status: string;
    paymentStatus: string;
    amountTotal?: number | null;
    currency?: string | null;
    customerEmail?: string | null;
  };
  user?: { id: string; premium: boolean };
  error?: string;
}

export const verifyCheckoutPayment = async (
  sessionId: string,
): Promise<VerifyPaymentResult> => {
  try {
    const res = await fetch("/api/verify-payment", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ sessionId }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        success: false,
        error: data?.error || "Payment verification failed",
      };
    }
    return data as VerifyPaymentResult;
  } catch (err) {
    console.log(err);
    return { success: false, error: "Payment verification failed" };
  }
};
