import Link from "next/link";
import { useUser } from "@clerk/nextjs";

import {
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/UserAvatar";

export function StudioSidebarHeader() {
  const { user } = useUser();
  const { state } = useSidebar();

  if (!user) {
    return (
      <SidebarHeader className="flex items-center justify-center pb-4">
        <Skeleton className="size-[112px] rounded-full" />

        <div className="flex flex-col items-center justify-center gap-y-1">
          <Skeleton className="h-[18px] w-[80px]" />
          <Skeleton className="h-[18px] w-[100px]" />
        </div>
      </SidebarHeader>
    );
  }

  if (state === "collapsed") {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton tooltip="Your profile" asChild>
          <Link href="/users/current">
            <UserAvatar
              imageUrl={user?.imageUrl}
              name={user?.fullName ?? "User"}
              size="xs"
            />
            <span className="text-sm">{user?.fullName ?? "User"}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarHeader className="flex items-center justify-center pb-4">
      <Link href="/users/current">
        <UserAvatar
          name={user?.fullName ?? "User"}
          imageUrl={user?.imageUrl}
          className="size-[112px] hover:opacity-75 transition"
        />
      </Link>
      <div className="flex flex-col items-center justify-center gap-y-1">
        <p className="text-sm font-semibold">Your profile</p>
        <p className="text-xs text-muted-foreground">
          {user?.fullName ?? "User"}
        </p>
      </div>
    </SidebarHeader>
  );
}
