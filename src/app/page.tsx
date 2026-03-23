import NextLink from "next/link";
import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getAuthSession();
  
  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-white p-6">
      <div className="max-w-3xl text-center space-y-8">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-emerald-400 text-transparent bg-clip-text">
          Next.js 14 SaaS Starter
        </h1>
        <p className="text-lg md:text-xl text-zinc-400">
          The perfect boilerplate for your next billion dollar idea. Powered by Next.js App Router, TailwindCSS, Prisma, Neon Postgres, and NextAuth.
        </p>
        <div className="pt-8">
          <NextLink
            href="/login"
            className="inline-flex h-12 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-zinc-950 shadow transition-colors hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50"
          >
            Get Started
          </NextLink>
        </div>
      </div>
    </main>
  );
}
