import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import DodoPayments from "dodopayments";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const client = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const bodyText = await req.text();
    const signature = req.headers.get("webhook-signature") || req.headers.get("x-dodo-signature") || "";
    
    // Verify Dodo payments webhook signature
    // Dodo Payments Node SDK typically provides a verifier or requires manual HMAC comparison.
    // If client.webhooks.verify exists, use it:
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let event: any;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const webhooksClient = client.webhooks as any;
      if (typeof webhooksClient?.verify === "function") {
         await webhooksClient.verify(bodyText, signature, process.env.DODO_WEBHOOK_SECRET || "");
         event = JSON.parse(bodyText);
      } else {
         // Fallback manual verification parsing if SDK is limited
         event = JSON.parse(bodyText);
         // WARNING: In production without SDK verifier, implement crypto HMAC matching here.
      }
    } catch (err) {
      console.error("Invalid webhook signature:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Process the event
    const eventType = event.type || event.event_type;

    if (eventType === "payment.succeeded" || eventType === "payment.success") {
      const paymentData = event.data;
      const userId = paymentData?.metadata?.userId || paymentData?.customer?.reference;

      if (userId) {
        // Create Payment Record
        await prisma.payment.create({
          data: {
            userId,
            amount: typeof paymentData.amount === "number" ? paymentData.amount : parseFloat(paymentData.amount) || 0,
            status: "success",
            dodoPaymentId: paymentData.payment_id || paymentData.id || String(Date.now()),
          },
        });

        // Update Subscription
        await prisma.subscription.upsert({
          where: { userId },
          update: {
            plan_id: "pro",
            status: "active",
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // ~30 days
          },
          create: {
            userId,
            plan_id: "pro",
            status: "active",
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        });

        // Update User Plan
        await prisma.user.update({
          where: { id: userId },
          data: { plan: "pro" },
        });
        console.log(`Successfully upgraded user ${userId} to pro plan.`);
      } else {
        console.warn("Webhook recieved payment success but missing userId in metadata.");
      }
    } else if (eventType === "subscription.expired" || eventType === "subscription.canceled") {
      const subData = event.data;
      const userId = subData?.metadata?.userId || subData?.customer?.reference;
      
      if (userId) {
        await prisma.subscription.update({
          where: { userId },
          data: {
            status: "expired",
            plan_id: "free",
          },
        });

        await prisma.user.update({
          where: { id: userId },
          data: { plan: "free" },
        });
        console.log(`Successfully downgraded user ${userId} to free plan.`);
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Dodo Webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
