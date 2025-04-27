"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { trpc } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/constants";

import {
  VideoGridCard,
  VideoGridCardSkeleton,
} from "@/features/videos/components/VideoGridCard";
import {
  VideoRowCard,
  VideoRowCardSkeleton,
} from "@/features/videos/components/VideoRowCard";

import { InfiniteScroll } from "@/components/InfiniteScroll";

type Props = {
  query: string | undefined;
  categoryId: string | undefined;
};

function ResultsSectionSuspence({ query, categoryId }: Props) {
  const [results, resultsQuery] = trpc.search.getMany.useSuspenseInfiniteQuery(
    {
      query,
      categoryId,
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (nextPage) => nextPage.nextCursor,
    }
  );

  return (
    <>
      <div className="block lg:hidden">
        <div className="flex flex-col gap-y-10 gap-4">
          {results?.pages
            ?.flatMap((page) => page?.items)
            ?.map((video) => (
              <VideoGridCard key={video.id} video={video} />
            ))}
        </div>
      </div>
      <div className="hidden lg:block">
        <div className="flex flex-col gap-4">
          {results?.pages
            ?.flatMap((page) => page?.items)
            ?.map((video) => (
              <VideoRowCard key={video.id} video={video} />
            ))}
        </div>
      </div>
      <InfiniteScroll
        hasNextPage={resultsQuery.hasNextPage}
        fetchNextPage={resultsQuery.fetchNextPage}
        isFetchingNextPage={resultsQuery.isFetchingNextPage}
      />
    </>
  );
}

function ResultsSectionSkeleton() {
  return (
    <>
      <div className="block lg:hidden">
        <div className="flex flex-col gap-y-10 gap-4">
          {Array.from({ length: 4 })?.map((_, index) => (
            <VideoGridCardSkeleton key={index} />
          ))}
        </div>
      </div>
      <div className="hidden lg:block">
        <div className="flex flex-col gap-4">
          {Array.from({ length: 4 })?.map((_, index) => (
            <VideoRowCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </>
  );
}

export function ResultsSection({ query, categoryId }: Props) {
  return (
    <Suspense fallback={<ResultsSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <ResultsSectionSuspence query={query} categoryId={categoryId} />
      </ErrorBoundary>
    </Suspense>
  );
}
