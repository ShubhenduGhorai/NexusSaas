import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import DodoPayments from "dodopayments";

const client = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY || "",
  environment: "test_mode", // Default to test environment
});

export async function POST() {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Example payload for creating a Dodo payment link
    const payment = await client.payments.create({
      billing: {
        city: "San Francisco",
        country: "US",
        state: "CA",
        street: "123 Market St",
        zipCode: "94105",
      },
      customer: {
        email: session.user.email || "",
        name: session.user.name || "",
      },
      productCart: [
        {
          productId: process.env.DODO_PRO_PRODUCT_ID || "prdt_pro_tier",
          quantity: 1,
        },
      ],
      returnUrl: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/billing?success=true`,
      metadata: {
        userId: session.user.id,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    // Dodo returns the link URL in the response
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const url = (payment as any).url || (payment as any).checkout_url || (payment as any).payment_link;
    return NextResponse.json({ url }, { status: 200 });
  } catch (error) {
    console.error("Dodo Payments checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
