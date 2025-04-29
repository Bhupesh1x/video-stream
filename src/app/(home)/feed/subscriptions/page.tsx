import { DEFAULT_LIMIT } from "@/constants";
import { HydrateClient, trpc } from "@/trpc/server";

import { SubscriptionsView } from "@/features/home/components/SubscriptionsView";

export const dynamic = "force-dynamic";

async function SubscriptionsPage() {
  void trpc.video.getManySubscriptions.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  });

  return (
    <HydrateClient>
      <SubscriptionsView />
    </HydrateClient>
  );
}

export default SubscriptionsPage;
