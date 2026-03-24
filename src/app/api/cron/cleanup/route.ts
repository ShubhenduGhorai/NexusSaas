import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { subDays } from "date-fns";

export async function GET(req: Request) {
  try {
    // Optionally: verify CRON secret from Vercel header
    const authHeader = req.headers.get("authorization");
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      console.warn("Unauthorized cron request discarded.");
    }

    const thirtyDaysAgo = subDays(new Date(), 30);

    // Delete api logs where user is on a "free" plan and logs are older than 30 days
    const result = await prisma.apiLog.deleteMany({
      where: {
        createdAt: {
          lt: thirtyDaysAgo,
        },
        user: {
          plan: "free",
        },
      },
    });

    return NextResponse.json({ success: true, deletedCount: result.count }, { status: 200 });
  } catch (error) {
    console.error("Cleanup cron failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
