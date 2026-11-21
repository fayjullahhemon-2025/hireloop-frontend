"use client";

import { Check, CreditCard, Lock, Sparkles } from "lucide-react";
import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { toast } from "@/components/ui/toast";

const PLAN = {
  name: "HireLoop Pro",
  tagline: "Access to all features",
  price: "$9.99",
  period: "/month",
  features: [
    "Apply to unlimited jobs",
    "Priority application review",
    "Access to all features",
  ],
} as const;

export default function PaymentPage() {
  const [pending, setPending] = useState(false);

  const handlePay = async () => {
    if (pending) return;
    setPending(true);
    try {
      const res = await fetch("/api/checkout_sessions", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.url) {
        toast.add({
          title: "Could not start checkout",
          description: data?.error || "Please try again.",
          type: "error",
        });
        return;
      }
      window.location.href = data.url;
    } catch {
      toast.add({
        title: "Could not start checkout",
        description: "Network error. Please try again.",
        type: "error",
      });
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <main className="mx-auto w-full max-w-lg px-4 py-12 sm:px-6">
        <div className="mb-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide text-zinc-300 uppercase">
            <Sparkles className="size-3.5 text-violet-400" />
            Upgrade to continue
          </span>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
            Choose your plan
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            You&apos;ve used all 5 free job applications. Unlock unlimited
            applications with HireLoop Pro.
          </p>
        </div>

        <div className="rounded-xl border border-violet-500/40 bg-zinc-900/60 p-6 shadow-[0_0_40px_rgba(124,58,237,0.15)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">{PLAN.name}</h2>
              <p className="mt-1 text-sm text-zinc-400">{PLAN.tagline}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-semibold tracking-tight">
                {PLAN.price}
              </p>
              <p className="text-xs text-zinc-500">{PLAN.period}</p>
            </div>
          </div>

          <ul className="mt-6 space-y-3">
            {PLAN.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 text-sm">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-violet-400">
                  <Check className="size-3" />
                </span>
                <span className="text-zinc-300">{feature}</span>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={handlePay}
            disabled={pending}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <CreditCard className="size-4" />
            {pending ? "Redirecting…" : "Pay with Stripe"}
          </button>

          <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-zinc-500">
            <Lock className="size-3" />
            Secure payment powered by Stripe
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-600">
          Cancel anytime. Your plan activates immediately after payment.
        </p>
      </main>
    </div>
  );
}
