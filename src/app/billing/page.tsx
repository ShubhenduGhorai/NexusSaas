import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPlanLimits } from "@/lib/config/pricing";
import { redirect } from "next/navigation";

export default async function BillingPage() {
  const session = await getAuthSession();
  
  if (!session?.user?.email) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white p-8 flex items-center justify-center">
        <h1 className="text-2xl font-semibold">Unauthorized. Please log in.</h1>
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { subscription: true },
  });

  if (!user) {
    redirect("/login");
  }

  const limits = getPlanLimits(user.plan);
  const requestsPercentage = Math.min((user.total_requests / limits.maxRequests) * 100, 100);
  const tokensPercentage = Math.min((user.total_tokens / limits.maxTokens) * 100, 100);

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="border-b border-zinc-800 pb-6">
          <h1 className="text-3xl font-bold tracking-tight">Billing & Usage</h1>
          <p className="text-zinc-400 mt-2">Manage your subscription and monitor your API usage.</p>
        </header>

        <main className="grid gap-6 md:grid-cols-2 mt-8">
          <div className="border border-zinc-800 rounded-lg p-6 flex flex-col justify-between bg-zinc-900/50">
            <div>
              <h3 className="font-semibold text-lg">Current Plan</h3>
              <p className="text-3xl font-bold mt-4 capitalize">{user.plan} Plan</p>
              {user.subscription?.status === "active" && (
                <p className="text-sm text-green-500 font-medium mt-2">Status: Active</p>
              )}
            </div>
            <div className="mt-6">
              {user.plan === "free" ? (
                <form action="/api/create-checkout" method="POST">
                  <button className="w-full bg-white text-black hover:bg-zinc-200 py-2 px-4 rounded-md font-medium" type="submit">
                    Upgrade to Pro
                  </button>
                </form>
              ) : (
                <button className="w-full border border-zinc-700 text-zinc-300 py-2 px-4 rounded-md font-medium cursor-not-allowed" disabled>
                  You are on the Pro plan
                </button>
              )}
            </div>
          </div>

          <div className="border border-zinc-800 rounded-lg p-6 space-y-6 bg-zinc-900/50">
            <h3 className="font-semibold text-lg">Usage</h3>

            <div className="space-y-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-zinc-300">API Requests</span>
                <span className="text-zinc-500">
                  {user.total_requests} / {limits.maxRequests}
                </span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2">
                <div className="bg-white h-2 rounded-full" style={{ width: `${requestsPercentage}%` }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-zinc-300">Token Usage</span>
                <span className="text-zinc-500">
                  {user.total_tokens.toLocaleString()} / {limits.maxTokens.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2">
                <div className="bg-white h-2 rounded-full" style={{ width: `${tokensPercentage}%` }}></div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800 mt-6">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-zinc-300">Estimated Cost</span>
                <span className="text-zinc-100">${user.total_cost.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
