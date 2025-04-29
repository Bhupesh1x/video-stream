import { DEFAULT_LIMIT } from "@/constants";
import { HydrateClient, trpc } from "@/trpc/server";

import { TrendingView } from "@/features/home/components/TrendingView";

export const dynamic = "force-dynamic";

async function TrendingPage() {
  void trpc.video.getManyTrending.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  });

  return (
    <HydrateClient>
      <TrendingView />
    </HydrateClient>
  );
}

export default TrendingPage;
