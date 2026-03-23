import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const status = searchParams.get("status");
    const date = searchParams.get("date");

    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {
      userId: session.user.id,
    };

    if (status) {
      where.status = status;
    }

    if (date) {
      // Very simple exact date matching based on Date object creation
      // A robust app might do a range query covering the full day
      const startOfDay = new Date(date);
      startOfDay.setUTCHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setUTCHours(23, 59, 59, 999);

      if (!isNaN(startOfDay.getTime())) {
         where.createdAt = {
           gte: startOfDay,
           lte: endOfDay,
         };
      }
    }

    const [logs, totalCount] = await Promise.all([
      prisma.apiLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.apiLog.count({ where }),
    ]);

    return NextResponse.json({
      data: logs,
      meta: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Failed to fetch API Logs:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
