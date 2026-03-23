import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { calculateCost } from "@/lib/pricing";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { provider, model, tokens_input, tokens_output, latency, status } = body;

    if (!provider || !model || typeof tokens_input !== "number" || typeof tokens_output !== "number") {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const cost = calculateCost(model, tokens_input, tokens_output);

    // 1. Check Limits
    const limitCheck = await import("@/lib/usage").then((m) =>
      m.checkLimits(session.user.id)
    );

    if (!limitCheck.allowed) {
      return NextResponse.json(
        { error: `Usage limit exceeded: ${limitCheck.reason}` },
        { status: 403 }
      );
    }

    // 2. Create Log
    const log = await prisma.apiLog.create({
      data: {
        userId: session.user.id,
        provider,
        model,
        tokens_input,
        tokens_output,
        cost,
        latency: latency || 0,
        status: status || "success",
      },
    });

    // 3. Increment Usage
    await import("@/lib/usage").then((m) =>
      m.incrementUsage({
        userId: session.user.id,
        cost,
        tokensInput: tokens_input,
        tokensOutput: tokens_output,
      })
    );

    return NextResponse.json(log, { status: 201 });
  } catch (error) {
    console.error("Failed to create API Log:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
