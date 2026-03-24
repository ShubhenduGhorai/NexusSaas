import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogoutButton from "./LogoutButton";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between border-b border-zinc-800 pb-6 mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {session.user.image ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-medium">
                  {session.user.name?.charAt(0) || session.user.email?.charAt(0) || "U"}
                </div>
              )}
              <span className="text-sm font-medium text-zinc-300">
                {session.user.name || session.user.email}
              </span>
            </div>
            <LogoutButton />
          </div>
        </header>

        <main>
          <DashboardClient />
        </main>
      </div>
    </div>
  );
}
