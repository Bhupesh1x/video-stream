"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { trpc } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/constants";

import { CommentForm } from "@/features/comments/components/CommentForm";
import { CommentItem } from "@/features/comments/components/CommentItem";

import { InfiniteScroll } from "@/components/InfiniteScroll";

type Props = {
  videoId: string;
};

function CommentSectionSuspense({ videoId }: Props) {
  const [comments, query] = trpc.comments.getMany.useSuspenseInfiniteQuery(
    { videoId, limit: DEFAULT_LIMIT },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  return (
    <div className="mt-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-bold">
          {comments?.pages?.[0]?.totalCount} Comments
        </h1>
        <CommentForm videoId={videoId} />
      </div>
      <div className="flex flex-col gap-4 mt-2">
        {comments?.pages
          ?.flatMap((values) => values?.items)
          ?.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        <InfiniteScroll
          isManual
          hasNextPage={query.hasNextPage}
          fetchNextPage={query.fetchNextPage}
          isFetchingNextPage={query.isFetchingNextPage}
        />
      </div>
    </div>
  );
}

export function CommentSectionSkeleton() {
  return <p>Loading...</p>;
}

export function CommentSection({ videoId }: Props) {
  return (
    <Suspense fallback={<CommentSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <CommentSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
}
