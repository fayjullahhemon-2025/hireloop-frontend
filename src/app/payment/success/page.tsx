"use client";

import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { verifyCheckoutPayment } from "@/lib/api/payments";

type VerifyState = "loading" | "success" | "error";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [state, setState] = useState<VerifyState>("loading");
  const [message, setMessage] = useState("");
  const [alreadyProcessed, setAlreadyProcessed] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      setState("error");
      setMessage("Missing checkout session id.");
      return;
    }

    let cancelled = false;

    (async () => {
      const result = await verifyCheckoutPayment(sessionId);
      if (cancelled) return;
      if (result.success) {
        setState("success");
        setAlreadyProcessed(Boolean(result.alreadyProcessed));
        setMessage(
          result.alreadyProcessed
            ? "This checkout session was already processed."
            : "Payment verified. Your account is now premium.",
        );
      } else {
        setState("error");
        setMessage(result.error || "Payment verification failed.");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return (
    <main className="mx-auto w-full max-w-lg px-4 py-16 sm:px-6">
      <div className="rounded-xl border border-white/10 bg-zinc-900/60 p-8 text-center">
        {state === "loading" && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="size-10 animate-spin text-violet-400" />
            <h1 className="text-xl font-semibold">Verifying payment…</h1>
            <p className="text-sm text-zinc-400">
              Confirming your Stripe checkout session.
            </p>
          </div>
        )}

        {state === "success" && (
          <div className="flex flex-col items-center gap-4">
            <CheckCircle2 className="size-12 text-emerald-400" />
            <h1 className="text-xl font-semibold">Payment successful</h1>
            <p className="text-sm text-zinc-400">{message}</p>
            {alreadyProcessed && (
              <p className="text-xs text-zinc-500">
                Session was already recorded — no duplicate charge or update.
              </p>
            )}
            <Link
              href="/dashboard/seeker"
              className="mt-2 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-500"
            >
              Go to Dashboard
            </Link>
          </div>
        )}

        {state === "error" && (
          <div className="flex flex-col items-center gap-4">
            <XCircle className="size-12 text-rose-400" />
            <h1 className="text-xl font-semibold">
              Payment verification failed
            </h1>
            <p className="text-sm text-zinc-400">{message}</p>
            <Link
              href="/payment"
              className="mt-2 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-500"
            >
              Back to payment
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <Suspense
        fallback={
          <main className="mx-auto w-full max-w-lg px-4 py-16 sm:px-6">
            <div className="rounded-xl border border-white/10 bg-zinc-900/60 p-8 text-center">
              <Loader2 className="mx-auto size-10 animate-spin text-violet-400" />
            </div>
          </main>
        }
      >
        <SuccessContent />
      </Suspense>
    </div>
  );
}
