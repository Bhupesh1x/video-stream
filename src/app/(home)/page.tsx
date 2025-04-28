import { DEFAULT_LIMIT } from "@/constants";
import { HydrateClient, trpc } from "@/trpc/server";

import { HomeView } from "@/features/home/components/HomeView";

type Props = {
  searchParams: Promise<{
    categoryId?: string;
  }>;
};

export const dynamic = "force-dynamic";

async function Page({ searchParams }: Props) {
  const { categoryId } = await searchParams;
  void trpc.categories.getMany.prefetch();
  void trpc.video.getMany.prefetchInfinite({
    limit: DEFAULT_LIMIT,
    categoryId,
  });

  return (
    <HydrateClient>
      <HomeView categoryId={categoryId} />
    </HydrateClient>
  );
}

export default Page;
