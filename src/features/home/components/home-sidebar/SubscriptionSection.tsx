"use client";

import Link from "next/link";
import { ListIcon } from "lucide-react";
import { usePathname } from "next/navigation";

import { trpc } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/constants";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/UserAvatar";

function SubscriptionSectionSkeleton() {
  return Array.from({ length: 4 }).map((_, index) => (
    <SidebarMenuItem key={index}>
      <SidebarMenuButton disabled asChild>
        <Skeleton className="h-[32px] w-full rounded-[6px]" />
      </SidebarMenuButton>
    </SidebarMenuItem>
  ));
}

export function SubscriptionSection() {
  const pathname = usePathname();
  const { data, isLoading } = trpc.subscriptions.getMany.useInfiniteQuery(
    { limit: DEFAULT_LIMIT },
    {
      getNextPageParam: (nextPage) => nextPage?.nextCursor,
    }
  );

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Subscription</SidebarGroupLabel>
      <SidebarMenu>
        {isLoading ? <SubscriptionSectionSkeleton /> : null}
        {!isLoading
          ? data?.pages
              ?.flatMap((page) => page?.items)
              ?.map((subscription) => (
                <SidebarMenuItem
                  key={`${subscription?.creatorId}-${subscription?.viewerId}`}
                >
                  <SidebarMenuButton
                    asChild
                    tooltip={subscription?.user?.name}
                    isActive={pathname === `/users/${subscription?.creatorId}`}
                  >
                    <Link
                      href={`/users/${subscription?.creatorId}`}
                      className="flex items-center gap-4"
                    >
                      <UserAvatar
                        size="xs"
                        imageUrl={subscription?.user?.imageUrl || ""}
                        name={subscription?.user?.name || ""}
                      />
                      <span className="text-sm">
                        {subscription?.user?.name || ""}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))
          : null}
        {!isLoading ? (
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="All subscriptions"
              isActive={pathname === `/subscription`}
            >
              <Link href="/subscriptions" className="flex items-center gap-4">
                <ListIcon className="size-4" />
                <span className="text-sm">All Subscriptions</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ) : null}
      </SidebarMenu>
    </SidebarGroup>
  );
}
