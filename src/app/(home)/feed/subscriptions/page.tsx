import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { DEFAULT_LIMIT } from "@/constants";
import { HydrateClient, trpc } from "@/trpc/server";

import { SubscriptionsView } from "@/features/home/components/SubscriptionsView";

export const dynamic = "force-dynamic";

async function SubscriptionsPage() {
  const { userId } = await auth();

  void trpc.video.getManySubscriptions.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  });

  if (!userId) {
    return redirect("/sign-in");
  }

  return (
    <HydrateClient>
      <SubscriptionsView />
    </HydrateClient>
  );
}

export default SubscriptionsPage;
