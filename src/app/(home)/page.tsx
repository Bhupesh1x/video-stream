import { HydrateClient, trpc } from "@/trpc/server";

import { HomeView } from "@/features/home/components/HomeView";

type Props = {
  searchParams: Promise<{
    categoryId?: string;
  }>;
};

async function Page({ searchParams }: Props) {
  const { categoryId } = await searchParams;
  void trpc.categories.getMany.prefetch();

  return (
    <HydrateClient>
      <HomeView categoryId={categoryId} />
    </HydrateClient>
  );
}

export default Page;
