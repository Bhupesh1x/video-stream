import { DEFAULT_LIMIT } from "@/constants";
import { trpc, HydrateClient } from "@/trpc/server";

import { StudioView } from "@/features/studio/components/StudioView";

function StudioPage() {
  void trpc.studio.getMany.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  });

  return (
    <HydrateClient>
      <StudioView />
    </HydrateClient>
  );
}

export default StudioPage;
