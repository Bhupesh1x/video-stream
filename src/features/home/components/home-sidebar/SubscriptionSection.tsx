"use client";

import Link from "next/link";
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
import { UserAvatar } from "@/components/UserAvatar";

export function SubscriptionSection() {
  const pathname = usePathname();
  const { data } = trpc.subscriptions.getMany.useInfiniteQuery(
    { limit: DEFAULT_LIMIT },
    {
      getNextPageParam: (nextPage) => nextPage?.nextCursor,
    }
  );

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Subscription</SidebarGroupLabel>
      <SidebarMenu>
        {data?.pages
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
          ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
