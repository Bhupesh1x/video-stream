"use client";

import Link from "next/link";
import { toast } from "sonner";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { trpc } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/constants";

import { Skeleton } from "@/components/ui/skeleton";
import { InfiniteScroll } from "@/components/InfiniteScroll";

import { SubscriptionItem } from "../components/SubscriptionItem";

function SubscriptionSectionSuspense() {
  const [subscriptions, query] =
    trpc.subscriptions.getMany.useSuspenseInfiniteQuery(
      {
        limit: DEFAULT_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
      }
    );

  const utils = trpc.useUtils();
  const unsubscribe = trpc.subscriptions.remove.useMutation();

  function onUnsubscribe(creatorId: string) {
    unsubscribe.mutate(
      { userId: creatorId },
      {
        onSuccess: (data) => {
          toast.success("Unsubscribed");

          utils.subscriptions.getMany.invalidate();
          utils.video.getManySubscriptions.invalidate();
          utils.user.getOne.invalidate({ id: data?.creatorId });
        },
        onError: () => {
          toast.error("Something went wrong! Failed to unsubscribe");
        },
      }
    );
  }

  return (
    <div>
      <div className="gap-4 gap-y-10 flex flex-col">
        {subscriptions?.pages
          ?.flatMap((page) => page?.items)
          ?.map((subscription) => (
            <Link
              key={subscription?.creatorId}
              href={subscription?.creatorId || "#"}
            >
              <SubscriptionItem
                name={subscription?.user?.name || ""}
                imageUrl={subscription?.user?.imageUrl || ""}
                subscriberCount={subscription?.user?.subscriberCount}
                disabled={unsubscribe?.isPending}
                onUnsubscribe={() =>
                  onUnsubscribe(subscription?.creatorId || "")
                }
              />
            </Link>
          ))}
      </div>
      <InfiniteScroll
        isManual
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      />
    </div>
  );
}

function SubscriptionSectionSkeleton() {
  return (
    <div className="gap-4 gap-y-10 flex flex-col">
      {Array.from({ length: 10 }).map((_, index) => (
        <div className="flex items-center justify-between gap-2" key={index}>
          <div className="flex-1 flex items-center gap-2">
            <Skeleton className="size-9 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-[20px] w-[100px]" />
              <Skeleton className="h-[16px] w-[150px]" />
            </div>
          </div>

          <Skeleton className="h-[36px] w-[117px] rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function SubscriptionSection() {
  return (
    <Suspense fallback={<SubscriptionSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <SubscriptionSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
}
