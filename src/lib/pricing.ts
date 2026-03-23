export const pricing = {
  "gpt-4": { input: 0.03, output: 0.06 },
  "gpt-3.5": { input: 0.001, output: 0.002 },
};

export function calculateCost(
  model: string,
  tokensInput: number,
  tokensOutput: number
): number {
  const modelPricing = pricing[model as keyof typeof pricing];

  if (!modelPricing) {
    // If model is unknown, return 0 or throw error
    return 0;
  }

  const cost =
    (tokensInput / 1000) * modelPricing.input +
    (tokensOutput / 1000) * modelPricing.output;

  return cost;
}
