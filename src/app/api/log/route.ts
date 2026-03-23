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

    return NextResponse.json(log, { status: 201 });
  } catch (error) {
    console.error("Failed to create API Log:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
