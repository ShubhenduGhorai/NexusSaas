import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { type, threshold } = body;

    if (!["cost", "latency"].includes(type) || typeof threshold !== "number") {
      return NextResponse.json({ error: "Invalid payload. 'type' must be 'cost' or 'latency' and 'threshold' must be a number." }, { status: 400 });
    }

    const alert = await prisma.alert.create({
      data: {
        userId: session.user.id,
        type,
        threshold,
      },
    });

    return NextResponse.json({ success: true, alert }, { status: 201 });
  } catch (error) {
    console.error("Failed to create alert rule:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rules = await prisma.alert.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    const events = await prisma.alertEvent.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return NextResponse.json({ rules, events }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch alerts overview:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
