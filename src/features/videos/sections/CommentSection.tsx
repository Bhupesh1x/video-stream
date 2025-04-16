"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { trpc } from "@/trpc/client";
import { CommentForm } from "@/features/comments/components/CommentForm";
import { CommentItem } from "@/features/comments/components/CommentItem";

type Props = {
  videoId: string;
};

function CommentSectionSuspense({ videoId }: Props) {
  const [comments] = trpc.comments.getMany.useSuspenseQuery({ videoId });

  return (
    <div className="mt-6">
      <div className="flex flex-col gap-4">
        <h1>{0} Comments</h1>
        <CommentForm videoId={videoId} />
      </div>
      <div className="flex flex-col gap-4 mt-2">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
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
