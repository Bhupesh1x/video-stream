import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

import { UserInfo } from "@/features/users/components/UserInfo";
import { useSubscriptions } from "@/features/subscriptions/hooks/useSubscriptions";
import { SubscribeButton } from "@/features/subscriptions/components/SubscribeButton";

import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/UserAvatar";

import { VideoWithUserInfo } from "../types";

type Props = {
  user: VideoWithUserInfo["user"];
  videoId: VideoWithUserInfo["id"];
};

export function VideoOwner({ user, videoId }: Props) {
  const { userId: clerkUserId, isLoaded } = useAuth();

  const { isPending, onClick } = useSubscriptions({
    creatorId: user.id,
    isSubscribed: user.viewerSubscribed,
    fromVideoId: videoId,
  });

  return (
    <div className="flex items-center justify-between gap-4">
      <Link href={`/users/${user.id}`}>
        <div className="flex items-center gap-x-2">
          <UserAvatar
            imageUrl={user?.imageUrl || ""}
            name={user?.name}
            size="lg"
          />
          <div className="flex flex-col gap-[1px]">
            <UserInfo size="lg" name={user?.name || " "} />
            <span className="text-sm text-muted-foreground line-clamp-1">
              {user?.subscriptionCount || 0} subscribers
            </span>
          </div>
        </div>
      </Link>

      {clerkUserId === user?.clerkId ? (
        <Button className="rounded-full" asChild>
          <Link href={`/studio/videos/${videoId}`}>Edit video</Link>
        </Button>
      ) : (
        <SubscribeButton
          onClick={onClick}
          isSubscribed={user?.viewerSubscribed}
          disabled={isPending || !isLoaded}
          className="flex-none"
        />
      )}
    </div>
  );
}
