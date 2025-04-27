import { DEFAULT_LIMIT } from "@/constants";
import { HydrateClient, trpc } from "@/trpc/server";

import { SearchView } from "@/features/search/views/SearchView";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{
    query: string | undefined;
    categoryId: string | undefined;
  }>;
};

async function SearchPage({ searchParams }: Props) {
  const { query, categoryId } = await searchParams;

  void trpc.categories.getMany.prefetch();
  void trpc.search.getMany.prefetchInfinite({
    limit: DEFAULT_LIMIT,
    categoryId,
    query,
  });

  return (
    <HydrateClient>
      <SearchView searchParams={{ query, categoryId }} />
    </HydrateClient>
  );
}

export default SearchPage;
