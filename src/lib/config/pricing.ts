export const PRICING_CONFIG = {
  free: {
    maxRequests: 10,
    maxTokens: 50000,
    price: 0,
    name: "Free Plan",
  },
  pro: {
    maxRequests: 500,
    maxTokens: 5000000,
    price: 15,
    name: "Pro Plan",
  },
} as const;

export type PlanType = keyof typeof PRICING_CONFIG;

export function getPlanLimits(planId: string) {
  const normalizedPlanId = planId.toLowerCase() as PlanType;
  return PRICING_CONFIG[normalizedPlanId] || PRICING_CONFIG.free;
}
