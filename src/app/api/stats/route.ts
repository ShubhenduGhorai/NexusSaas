import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { subDays, startOfDay, startOfMonth, format } from "date-fns";

export async function GET() {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const thirtyDaysAgo = subDays(now, 30);
    
    // Fetch logs for the last 30 days
    const logs = await prisma.apiLog.findMany({
      where: {
        userId: session.user.id,
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    });

    let totalCostToday = 0;
    let monthlyCost = 0;
    let totalLatency = 0;
    let errorCount = 0;
    
    const startOfTodayDt = startOfDay(now).getTime();
    const startOfMonthDt = startOfMonth(now).getTime();

    const timeline: Record<string, { date: string, displayDate: string, cost: number, requests: number }> = {};

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    logs.forEach((log: any) => {
      const logTime = log.createdAt.getTime();
      
      // Todays cost
      if (logTime >= startOfTodayDt) {
        totalCostToday += log.cost;
      }
      
      // Monthly cost
      if (logTime >= startOfMonthDt) {
        monthlyCost += log.cost;
      }

      // Latency total for avg
      totalLatency += log.latency;

      // Error count
      if (log.status !== "success") {
        errorCount += 1;
      }

      // Timeline mapping
      const dateKey = format(log.createdAt, "yyyy-MM-dd");
      const displayKey = format(log.createdAt, "MMM dd");
      if (!timeline[dateKey]) {
        timeline[dateKey] = { date: dateKey, displayDate: displayKey, cost: 0, requests: 0 };
      }
      timeline[dateKey].cost += log.cost;
      timeline[dateKey].requests += 1;
    });

    const avgLatency = logs.length > 0 ? Math.round(totalLatency / logs.length) : 0;
    const errorRate = logs.length > 0 ? ((errorCount / logs.length) * 100).toFixed(2) : 0;

    const chartData = Object.values(timeline).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return NextResponse.json({
      totalCostToday: totalCostToday.toFixed(4),
      monthlyCost: monthlyCost.toFixed(4),
      avgLatency,
      errorRate,
      chartData,
    });
  } catch (error) {
    console.error("Failed to fetch API Stats:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
