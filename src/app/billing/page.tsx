import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import BillingClient from "./BillingClient";

export default async function BillingPage() {
  const session = await getAuthSession();
  
  if (!session?.user?.email) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white p-8 flex items-center justify-center">
        <h1 className="text-2xl font-semibold">Unauthorized. Please log in.</h1>
      </div>
    );
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="border-b border-zinc-800 pb-6">
          <h1 className="text-3xl font-bold tracking-tight">Billing & Plans</h1>
          <p className="text-zinc-400 mt-2">Manage your subscription and API usage limits.</p>
        </header>
        
        <main>
          <BillingClient currentPlan={dbUser?.plan || "free"} />
        </main>
      </div>
    </div>
  );
}
