import { CornerDownRightIcon, Loader2Icon } from "lucide-react";

import { trpc } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/constants";

import { Button } from "@/components/ui/button";

import { CommentItem } from "./CommentItem";

type Props = {
  videoId: string;
  parentId: string;
};

export function CommentRepliesItem({ videoId, parentId }: Props) {
  const {
    data: replies,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = trpc.comments.getMany.useInfiniteQuery(
    {
      videoId,
      limit: DEFAULT_LIMIT,
      parentId,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  return (
    <div className="pl-14 mt-2">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center gap-4 mt-2">
          <Loader2Icon className="text-muted-foreground animate-spin" />
        </div>
      ) : null}

      {replies?.pages
        ?.flatMap((values) => values?.items)
        ?.map((comment) => (
          <CommentItem key={comment.id} comment={comment} variant="reply" />
        ))}
      {hasNextPage ? (
        <Button
          variant="tertiary"
          className="h-8"
          type="button"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          <CornerDownRightIcon />
          Show more replies
        </Button>
      ) : null}
    </div>
  );
}
