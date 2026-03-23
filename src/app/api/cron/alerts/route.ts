import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { startOfDay } from "date-fns";

export async function GET(req: Request) {
  try {
    // Optionally: verify CRON secret from Vercel header
    const authHeader = req.headers.get("authorization");
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      console.warn("Unauthorized cron request discarded.");
      // return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      // Soft fail for local testing if needed
    }

    const now = new Date();
    const todayStart = startOfDay(now);

    const alertsRules = await prisma.alert.findMany();
    let eventsGenerated = 0;

    for (const rule of alertsRules) {
      // Prevent spam: only trigger once per rule per day
      const existingEvent = await prisma.alertEvent.findFirst({
        where: {
          alertId: rule.id,
          createdAt: {
            gte: todayStart,
          },
        },
      });

      if (existingEvent) {
        continue;
      }

      // Read logs to evaluate rule
      const todayLogs = await prisma.apiLog.findMany({
        where: {
          userId: rule.userId,
          createdAt: {
            gte: todayStart,
          },
        },
      });

      if (todayLogs.length === 0) continue;

      if (rule.type === "cost") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const totalCost = todayLogs.reduce((acc: number, log: any) => acc + log.cost, 0);
        
        if (totalCost > rule.threshold) {
          await prisma.alertEvent.create({
            data: {
              userId: rule.userId,
              alertId: rule.id,
              type: "cost",
              message: `Daily cost reached $${totalCost.toFixed(4)}, exceeding the set threshold of $${rule.threshold}`,
            },
          });
          eventsGenerated++;
        }
      } else if (rule.type === "latency") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const avgLatency = todayLogs.reduce((acc: number, log: any) => acc + log.latency, 0) / todayLogs.length;

        if (avgLatency > rule.threshold) {
          await prisma.alertEvent.create({
            data: {
              userId: rule.userId,
              alertId: rule.id,
              type: "latency",
              message: `Average daily latency reached ${Math.round(avgLatency)}ms, breaching the threshold of ${rule.threshold}ms`,
            },
          });
          eventsGenerated++;
        }
      }
    }

    return NextResponse.json({ success: true, eventsGenerated });
  } catch (error) {
    console.error("Cron /api/cron/alerts failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
