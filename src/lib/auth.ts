import { createClient } from "./supabase-server";
import { prisma } from "./prisma";

export async function getAuthSession() {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  if (user.email) {
    // Sync user to Prisma database so external relations (ApiLog, Subscription, etc) work
    let dbUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          id: user.id, // Keep IDs in sync
          email: user.email,
          name: user.user_metadata?.full_name || user.email.split("@")[0],
        },
      });
    }

    // Return the expected NextAuth-like session object
    return {
      user: {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        image: dbUser.image,
      },
    };
  }

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.full_name || null,
    },
  };
}
