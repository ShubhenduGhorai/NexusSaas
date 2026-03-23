import { prisma } from "./prisma";
import { getPlanLimits } from "./config/pricing";

export async function checkLimits(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true, total_requests: true, total_tokens: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const limits = getPlanLimits(user.plan);

  if (user.total_requests >= limits.maxRequests) {
    return { allowed: false, reason: "MAX_REQUESTS_REACHED" };
  }

  if (user.total_tokens >= limits.maxTokens) {
    return { allowed: false, reason: "MAX_TOKENS_REACHED" };
  }

  return { allowed: true };
}

export async function incrementUsage({
  userId,
  cost,
  tokensInput,
  tokensOutput,
}: {
  userId: string;
  cost: number;
  tokensInput: number;
  tokensOutput: number;
}) {
  const totalTokens = tokensInput + tokensOutput;

  await prisma.user.update({
    where: { id: userId },
    data: {
      total_requests: { increment: 1 },
      total_tokens: { increment: totalTokens },
      total_cost: { increment: cost },
    },
  });
}
