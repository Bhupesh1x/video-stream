import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { db } from "@/db";
import { users } from "@/db/schema";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const [user] = await db.select().from(users).where(eq(users.clerkId, userId));

  if (!user) {
    return redirect("/sign-in");
  }

  redirect(`/users/${user.id}`);
}
