"use client";

import { useState } from "react";

export default function BillingClient({ currentPlan }: { currentPlan: string }) {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
      });
      const data = await res.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Failed to create checkout. " + (data.error || ""));
      }
    } catch (e) {
      console.error(e);
      alert("An error occurred creating the checkout session.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      {/* Free Plan */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 flex flex-col">
        <h2 className="text-xl font-semibold mb-2">Hobby Plan</h2>
        <p className="text-zinc-400 text-sm mb-6 flex-grow">
          Perfect for starting out and testing the platform.
        </p>
        <div className="text-3xl font-bold mb-6">$0<span className="text-lg text-zinc-500 font-normal">/mo</span></div>
        <button 
          disabled
          className="w-full rounded-md bg-zinc-800 py-2.5 text-sm font-medium text-zinc-400 cursor-not-allowed"
        >
          {currentPlan === "free" ? "Current Plan" : "Downgrade"}
        </button>
      </div>

      {/* Pro Plan */}
      <div className="rounded-xl border border-blue-500/50 bg-blue-950/20 p-6 flex flex-col relative overflow-hidden">
        {currentPlan === "pro" && (
          <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg tracking-wider">
            ACTIVE
          </div>
        )}
        <h2 className="text-xl font-semibold mb-2 text-white">Pro Plan</h2>
        <p className="text-blue-200/60 text-sm mb-6 flex-grow">
          Unlock all features, higher API limits, and robust premium support elements.
        </p>
        <div className="text-3xl font-bold mb-6 text-white">$29<span className="text-lg text-blue-200/50 font-normal">/mo</span></div>
        <button 
          onClick={handleUpgrade}
          disabled={currentPlan === "pro" || loading}
          className={`w-full rounded-md py-2.5 text-sm font-medium transition-colors ${
            currentPlan === "pro" 
              ? "bg-blue-500/20 text-blue-300 cursor-not-allowed" 
              : "bg-blue-600 text-white hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/20"
          }`}
        >
          {loading ? "Redirecting..." : currentPlan === "pro" ? "Current Plan" : "Upgrade to Pro"}
        </button>
      </div>
    </div>
  );
}
