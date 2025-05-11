"use client";

import Link from "next/link";
import { useAuth, useClerk } from "@clerk/nextjs";

import { SubscribeButton } from "@/features/subscriptions/components/SubscribeButton";
import { useSubscriptions } from "@/features/subscriptions/hooks/useSubscriptions";

import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/UserAvatar";

import { UserType } from "../types";

type Props = {
  user: UserType;
};

export function UserSectionInfo({ user }: Props) {
  const { userId: clerkId, isLoaded } = useAuth();
  const { openUserProfile } = useClerk();

  const { isPending, onClick } = useSubscriptions({
    creatorId: user.id,
    isSubscribed: user.viewerSubscribed,
  });

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 w-full">
        <div className="block md:hidden">
          <UserAvatar
            imageUrl={user?.imageUrl}
            name={user?.name}
            size="xlg"
            onClick={() => {
              if (clerkId === user?.clerkId) {
                openUserProfile();
              }
            }}
            className={`${
              clerkId === user?.clerkId
                ? "cursor-pointer hover:opacity-85 transition-opacity"
                : ""
            }`}
          />
        </div>
        <div className="hidden md:block">
          <UserAvatar
            imageUrl={user?.imageUrl}
            name={user?.name}
            size="xl"
            onClick={() => {
              if (clerkId === user?.clerkId) {
                openUserProfile();
              }
            }}
            className={`${
              clerkId === user?.clerkId
                ? "cursor-pointer hover:opacity-85 transition-opacity"
                : ""
            }`}
          />
        </div>

        <div className="space-y-[2px] flex-1 w-full">
          <h4 className="text-lg lg:text-4xl font-semibold line-clamp-2">
            {user?.name || "User"}
          </h4>
          <p className="text-sm text-muted-foreground md:!mt-1">
            {user?.subscriberCount || 0} Subscribers • {user?.videoCount || 0}{" "}
            Videos
          </p>
          <div className="hidden md:block">
            {clerkId === user?.clerkId ? (
              <Button asChild variant="outline" className="rounded-full mt-2">
                <Link prefetch href="/studio">
                  Go to studio
                </Link>
              </Button>
            ) : (
              <SubscribeButton
                disabled={!isLoaded || isPending}
                isSubscribed={user?.viewerSubscribed}
                onClick={onClick}
                className="mt-2 rounded-full"
              />
            )}
          </div>
        </div>
      </div>
      <div className="block md:hidden">
        {clerkId === user?.clerkId ? (
          <Button
            asChild
            variant="outline"
            className="w-full rounded-full mt-3"
          >
            <Link prefetch href="/studio">
              Go to studio
            </Link>
          </Button>
        ) : (
          <SubscribeButton
            disabled={!isLoaded || isPending}
            isSubscribed={user?.viewerSubscribed}
            onClick={onClick}
            className="w-full mt-3 rounded-full"
          />
        )}
      </div>
    </div>
  );
}
