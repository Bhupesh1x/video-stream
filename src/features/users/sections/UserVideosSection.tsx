"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { trpc } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/constants";

import {
  VideoGridCard,
  VideoGridCardSkeleton,
} from "@/features/videos/components/VideoGridCard";

import { InfiniteScroll } from "@/components/InfiniteScroll";

type Props = {
  userId: string;
};

function UserVideosSectionSuspense({ userId }: Props) {
  const [videos, query] = trpc.video.getMany.useSuspenseInfiniteQuery(
    {
      userId,
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  return (
    <div>
      <div className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
        {videos?.pages
          ?.flatMap((page) => page?.items)
          ?.map((video) => (
            <VideoGridCard key={video.id} video={video} />
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

function UserVideosSectionSkeleton() {
  return (
    <div className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
      {Array.from({ length: 16 })?.map((_, index) => (
        <VideoGridCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function UserVideosSection(props: Props) {
  return (
    <Suspense fallback={<UserVideosSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <UserVideosSectionSuspense {...props} />
      </ErrorBoundary>
    </Suspense>
  );
}
