import { trpc, HydrateClient } from "@/trpc/server";

import { DEFAULT_LIMIT } from "@/constants";

import { SubscriptionView } from "@/features/subscriptions/views/SubscriptionView";

export const dynamic = "force-dynamic";

function SubscriptionsPage() {
  void trpc.subscriptions.getMany.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  });

  return (
    <HydrateClient>
      <SubscriptionView />
    </HydrateClient>
  );
}

export default SubscriptionsPage;
