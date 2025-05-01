"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { trpc } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/constants";

import {
  VideoRowCard,
  VideoRowCardSkeleton,
} from "@/features/videos/components/VideoRowCard";

import { InfiniteScroll } from "@/components/InfiniteScroll";

function HistorySectionSuspense() {
  const [videos, query] = trpc.playlists.getHistory.useSuspenseInfiniteQuery(
    {
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  console.log("bh-videos", videos);

  return (
    <div>
      <div className="gap-4 gap-y-10 flex flex-col">
        {videos?.pages
          ?.flatMap((page) => page?.items)
          ?.map((video) => (
            <VideoRowCard key={video.id} video={video} />
          ))}
      </div>
      <InfiniteScroll
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      />
    </div>
  );
}

function HistorySectionSkeleton() {
  return (
    <div className="gap-4 gap-y-10 flex flex-col">
      {Array.from({ length: 6 })?.map((_, index) => (
        <VideoRowCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function HistorySection() {
  return (
    <Suspense fallback={<HistorySectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <HistorySectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
}
