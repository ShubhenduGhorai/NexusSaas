import NextLink from "next/link";
import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ArrowRight, BarChart3, Activity, Layers, AlertCircle, EyeOff, Coins, Check } from "lucide-react";

export default async function Home() {
  const session = await getAuthSession();
  
  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-zinc-50 font-sans selection:bg-purple-500/30">
      
      {/* Navbar Minimal */}
      <nav className="w-full flex justify-between items-center max-w-6xl mx-auto p-6 absolute top-0 z-50">
        <div className="font-bold text-xl tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">NexusAPI</div>
        <div className="flex gap-4 items-center">
          <NextLink href="/login" className="text-sm font-medium hover:text-blue-400 transition-colors">Log in</NextLink>
          <NextLink href="/login" className="text-sm font-medium bg-white text-zinc-950 px-4 py-2 rounded-full hover:bg-zinc-200 transition-colors">Start Free</NextLink>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="w-full max-w-6xl mx-auto px-6 pt-40 pb-24 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium mb-8 border border-blue-500/20">
          <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
          Now tracking Groq and OpenAI
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
          Stop wasting money on <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">APIs you don’t understand</span>
        </h1>
        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-12">
          Track cost, latency, and errors across OpenAI, Groq, and more — in real-time. Gain complete visibility into your generative AI spend.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <NextLink
            href="/login"
            className="flex items-center justify-center gap-2 h-14 rounded-full bg-white px-8 text-base font-semibold text-zinc-950 shadow-lg shadow-white/10 transition-all hover:bg-zinc-200 hover:scale-105"
          >
            Start Free <ArrowRight className="w-4 h-4" />
          </NextLink>
          <NextLink
            href="/login"
            className="flex items-center justify-center gap-2 h-14 rounded-full bg-zinc-900 border border-zinc-800 px-8 text-base font-semibold hover:bg-zinc-800 transition-all text-white"
          >
            View Dashboard
          </NextLink>
        </div>
      </section>

      {/* Dashboard Preview / Solution */}
      <section className="w-full max-w-5xl mx-auto px-6 mb-32">
        <div className="relative rounded-2xl border border-zinc-800 bg-zinc-900/50 p-2 shadow-2xl overflow-hidden backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5"></div>
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-950 p-6 relative">
            {/* Mock UI */}
            <div className="flex justify-between items-center border-b border-zinc-800 pb-4 mb-6">
              <h3 className="font-semibold text-lg flex items-center gap-2"><Activity className="w-5 h-5 text-blue-400"/> Live Usage</h3>
              <div className="flex gap-2">
                <div className="w-24 h-8 rounded bg-zinc-800 animate-pulse"></div>
                <div className="w-24 h-8 rounded bg-zinc-800 animate-pulse"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800/50">
                <p className="text-sm text-zinc-400 mb-1">Total Cost (30d)</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-200 text-transparent bg-clip-text">$432.50</p>
              </div>
              <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800/50">
                <p className="text-sm text-zinc-400 mb-1">Avg Latency</p>
                <p className="text-3xl font-bold text-white">1.24s</p>
              </div>
              <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800/50">
                <p className="text-sm text-zinc-400 mb-1">Error Rate</p>
                <p className="text-3xl font-bold text-white">0.05%</p>
              </div>
            </div>
            <div className="h-48 w-full bg-zinc-900 rounded-lg border border-zinc-800/50 flex items-end p-4 gap-2">
               {/* Mock bars */}
               {[40, 70, 45, 90, 65, 80, 110, 60, 40, 120, 80, 95].map((h, i) => (
                  <div key={i} className="flex-1 bg-gradient-to-t from-blue-600 to-purple-500 rounded-t-sm opacity-80 transition-all duration-1000 ease-in-out hover:opacity-100" style={{ height: `${h}%` }}></div>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="w-full max-w-6xl mx-auto px-6 py-24 border-t border-zinc-800/50">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Why developers lose money on APIs</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg">You can&apos;t optimize what you can&apos;t measure. LLM APIs change pricing frequently and fail silently.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800">
            <Coins className="w-10 h-10 text-rose-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Hidden token costs</h3>
            <p className="text-zinc-400 leading-relaxed">System prompts and chat histories multiply your token usage invisibly. A small feature scales to $1k/mo instantly.</p>
          </div>
          <div className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800">
            <EyeOff className="w-10 h-10 text-orange-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No visibility into usage</h3>
            <p className="text-zinc-400 leading-relaxed">API providers only show aggregate usage. You don&apos;t know which user, prompt, or model is causing the spike.</p>
          </div>
          <div className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800">
            <AlertCircle className="w-10 h-10 text-yellow-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No alerts until it&apos;s too late</h3>
            <p className="text-zinc-400 leading-relaxed">Finding out about a bad code deployment consuming thousands of API requests from your end-of-month bill.</p>
          </div>
        </div>
      </section>

      {/* Solution & Features Section */}
      <section className="w-full bg-zinc-900/20 border-t border-zinc-800/50 py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">See everything. Control everything.</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-lg">The ultimate observability platform for GenAI applications.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-950 shadow-xl transition hover:-translate-y-1 duration-300">
              <BarChart3 className="w-12 h-12 text-blue-400 mb-6" />
              <h3 className="text-2xl font-bold mb-3">Real-time Cost Tracking</h3>
              <p className="text-zinc-400">Track exactly how much each API call, prompt, user, and session costs your business in real-time.</p>
            </div>
            <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-950 shadow-xl transition hover:-translate-y-1 duration-300">
              <Activity className="w-12 h-12 text-purple-400 mb-6" />
              <h3 className="text-2xl font-bold mb-3">Performance Insights</h3>
              <p className="text-zinc-400">Monitor latency and error rates. Identify bottlenecks and switch models dynamically to maintain uptime.</p>
            </div>
            <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-950 shadow-xl transition hover:-translate-y-1 duration-300">
              <Layers className="w-12 h-12 text-emerald-400 mb-6" />
              <h3 className="text-2xl font-bold mb-3">Unified Dashboard</h3>
              <p className="text-zinc-400">All APIs in one place. Connect OpenAI, Anthropic, Groq, Cohere, and local models under one pane of glass.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="w-full max-w-5xl mx-auto px-6 py-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Simple, transparent pricing</h2>
          <p className="text-zinc-400 text-lg">Start for free, upgrade when you need more power.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <div className="p-8 rounded-3xl border border-zinc-800 bg-zinc-900/30 flex flex-col">
            <h3 className="text-2xl font-semibold mb-2">Free</h3>
            <p className="text-zinc-400 mb-6">Perfect for side projects and testing.</p>
            <div className="mb-8">
              <span className="text-5xl font-bold">$0</span>
              <span className="text-zinc-400"> / forever</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3"><Check className="w-5 h-5 text-emerald-400" /> <span>1,000 requests</span></li>
              <li className="flex items-center gap-3"><Check className="w-5 h-5 text-emerald-400" /> <span>Basic dashboard</span></li>
              <li className="flex items-center gap-3"><Check className="w-5 h-5 text-emerald-400" /> <span>3-day log retention</span></li>
            </ul>
            <NextLink href="/login" className="w-full py-3 rounded-lg border border-zinc-700 font-medium text-center hover:bg-zinc-800 transition-colors">
              Get Started
            </NextLink>
          </div>

          {/* Pro Tier */}
          <div className="p-8 rounded-3xl border border-blue-500/30 bg-gradient-to-b from-blue-950/40 to-zinc-950 relative flex flex-col shadow-2xl shadow-blue-500/5">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-xs font-bold tracking-wider uppercase text-white shadow-lg">
              Most Popular
            </div>
            <h3 className="text-2xl font-semibold mb-2">Pro</h3>
            <p className="text-zinc-400 mb-6">For scaling applications and startups.</p>
            <div className="mb-8">
              <span className="text-5xl font-bold">$29</span>
              <span className="text-zinc-400"> / month</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3"><Check className="w-5 h-5 text-blue-400" /> <span className="text-white">Unlimited logs</span></li>
              <li className="flex items-center gap-3"><Check className="w-5 h-5 text-blue-400" /> <span className="text-white">Custom alerts & notifications</span></li>
              <li className="flex items-center gap-3"><Check className="w-5 h-5 text-blue-400" /> <span className="text-white">Advanced analytics & exports</span></li>
              <li className="flex items-center gap-3"><Check className="w-5 h-5 text-blue-400" /> <span className="text-white">Priority support</span></li>
            </ul>
            <NextLink href="/login" className="w-full py-3 rounded-lg bg-white text-zinc-950 font-medium text-center hover:bg-zinc-200 transition-colors">
              Upgrade to Pro
            </NextLink>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-800 py-12 px-6 bg-zinc-950 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="font-bold text-xl tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">NexusAPI</div>
            <span className="text-zinc-500 text-sm">© {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-8">
            <NextLink href="#" className="text-zinc-400 hover:text-white transition-colors text-sm font-medium">Product</NextLink>
            <NextLink href="#" className="text-zinc-400 hover:text-white transition-colors text-sm font-medium">Pricing</NextLink>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
