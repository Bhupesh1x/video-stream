import { useEffect } from "react";

import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

import { Button } from "./ui/button";

type Props = {
  isManual?: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
};

export function InfiniteScroll({
  isManual = false,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: Props) {
  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.5,
    rootMargin: "100px",
  });

  useEffect(() => {
    if (hasNextPage && isIntersecting && !isFetchingNextPage && !isManual) {
      fetchNextPage();
    }
  }, [
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isIntersecting,
    isManual,
  ]);

  return (
    <div className="flex flex-col items-center p-4 gap-4">
      <div ref={targetRef} className="h-1" />

      {hasNextPage ? (
        <Button
          variant="secondary"
          disabled={!hasNextPage && isFetchingNextPage}
          onClick={fetchNextPage}
        >
          {isFetchingNextPage ? "Loading..." : "Load more"}
        </Button>
      ) : (
        <p className="text-xs text-muted-foreground">
          You have reached the end of the list
        </p>
      )}
    </div>
  );
}
