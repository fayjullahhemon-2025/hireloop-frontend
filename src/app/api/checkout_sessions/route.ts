import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";

const STRIPE_PRICE_ID =
  process.env.STRIPE_PRICE_ID || "price_1Ue8feB9rHDv4YqGTA9sHI2t";
const STRIPE_INTEGRATION_IDENTIFIER =
  process.env.STRIPE_INTEGRATION_IDENTIFIER || "hire_loop_web_001";

export async function POST() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const headersList = await headers();
    const origin =
      headersList.get("origin") ||
      process.env.BETTER_AUTH_URL ||
      "http://localhost:3000";

    // Always create a brand-new Checkout Session for this payment attempt.
    const checkoutSession = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: "payment",
      client_reference_id: session.user.id,
      metadata: {
        userId: session.user.id,
        email: session.user.email ?? "",
      },
      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment`,
      integration_identifier: STRIPE_INTEGRATION_IDENTIFIER,
    });

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
      isNewSession: true,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Checkout session creation failed";
    const status =
      typeof err === "object" && err !== null && "statusCode" in err
        ? Number((err as { statusCode?: number }).statusCode) || 500
        : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
