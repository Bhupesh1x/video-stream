"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { trpc } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/constants";

import { InfiniteScroll } from "@/components/InfiniteScroll";

import { VideoRowCard, VideoRowCardSkeleton } from "../components/VideoRowCard";
import {
  VideoGridCard,
  VideoGridCardSkeleton,
} from "../components/VideoGridCard";

type Props = {
  videoId: string;
  isManual?: boolean;
};

function SuggestionsSectionSuspense({ videoId, isManual }: Props) {
  const [suggestions, query] =
    trpc.suggestions.getMany.useSuspenseInfiniteQuery(
      {
        limit: DEFAULT_LIMIT,
        videoId,
      },
      { getNextPageParam: (lastPage) => lastPage.nextCursor }
    );

  return (
    <>
      <div className="hidden md:block space-y-3">
        {suggestions?.pages
          ?.flatMap((page) => page?.items)
          ?.map((video) => (
            <VideoRowCard key={video.id} video={video} variant="compact" />
          ))}
      </div>
      <div className="block md:hidden space-y-3">
        {suggestions?.pages
          ?.flatMap((page) => page?.items)
          ?.map((video) => (
            <VideoGridCard key={video.id} video={video} />
          ))}
      </div>
      <InfiniteScroll
        isManual={isManual}
        fetchNextPage={query.fetchNextPage}
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
      />
    </>
  );
}

function SuggestionsSectionSkeleton() {
  return (
    <>
      <div className="hidden md:block space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <VideoRowCardSkeleton key={index} />
        ))}
      </div>
      <div className="block md:hidden space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <VideoGridCardSkeleton key={index} />
        ))}
      </div>
    </>
  );
}

export function SuggestionsSection({ videoId, isManual }: Props) {
  return (
    <Suspense fallback={<SuggestionsSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <SuggestionsSectionSuspense videoId={videoId} isManual={isManual} />
      </ErrorBoundary>
    </Suspense>
  );
}
