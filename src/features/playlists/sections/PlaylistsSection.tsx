"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { trpc } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/constants";

import { VideoRowCardSkeleton } from "@/features/videos/components/VideoRowCard";

import { InfiniteScroll } from "@/components/InfiniteScroll";

function PlaylistsSectionSuspense() {
  const [playlists, query] = trpc.playlists.getMany.useSuspenseInfiniteQuery(
    {
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  return (
    <div>
      <div className="gap-4 gap-y-10 flex flex-col">
        {JSON.stringify(playlists)}
      </div>
      <InfiniteScroll
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      />
    </div>
  );
}

function PlaylistsSectionSkeleton() {
  return (
    <div className="gap-4 gap-y-10 flex flex-col">
      {Array.from({ length: 6 })?.map((_, index) => (
        <VideoRowCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function PlaylistsSection() {
  return (
    <Suspense fallback={<PlaylistsSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <PlaylistsSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
}
