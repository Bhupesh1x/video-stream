import Link from "next/link";
import { useMemo } from "react";
import { formatDistanceToNow } from "date-fns";

import { UserInfo } from "@/features/users/components/UserInfo";

import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/UserAvatar";

import { VideosType } from "../types";
import { VideoThumbnail } from "./VideoThumbnail";
import { VideoMenu } from "./VideoMenu";

interface Props {
  video: VideosType["items"][number];
  onRemove?: () => void;
}

export function VideoGridCardSkeleton() {
  return (
    <div className="w-full flex flex-col gap-2">
      <div className="relative aspect-video rounded-xl w-full overflow-hidden">
        <Skeleton className="size-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-5 w-[95%]" />
        <Skeleton className="h-5 w-[80%]" />
      </div>
    </div>
  );
}

export function VideoGridCard({ video }: Props) {
  const compactViews = useMemo(() => {
    return Intl.NumberFormat("en", {
      notation: "compact",
    }).format(video?.viewsCount ?? 0);
  }, [video?.viewsCount]);

  const compactDate = useMemo(() => {
    return formatDistanceToNow(video.createdAt, { addSuffix: true });
  }, [video?.createdAt]);

  return (
    <div className="flex justify-between gap-2 w-full">
      <div className="w-full flex flex-col gap-2">
        <Link href={`/videos/${video.id}`}>
          <VideoThumbnail
            title={video.title}
            duration={video?.duration ?? 0}
            previewUrl={video?.previewUrl ?? ""}
            thumbnailImageUrl={video?.thumbnailUrl ?? ""}
          />
        </Link>
        <div className="flex gap-2 w-full justify-between">
          <div>
            <div>
              <Link href={`/videos/${video.id}`}>
                <p
                  className="text-lg font-semibold line-clamp-2"
                  title={video.title}
                >
                  {video.title}
                </p>
              </Link>
              <div className="flex items-center gap-2">
                <Link href={`/users/${video.user.id}`}>
                  <UserAvatar
                    imageUrl={video.user?.imageUrl || ""}
                    name={video.user?.name}
                    size="sm"
                  />
                </Link>
                <Link href={`/users/${video.user.id}`}>
                  <UserInfo name={video?.user?.name || ""} />
                </Link>
              </div>
              <Link href={`/videos/${video.id}`}>
                <p className="text-muted-foreground my-1">
                  {compactViews} views • {compactDate ?? ""}
                </p>
              </Link>
            </div>
          </div>
          <VideoMenu videoId={video.id} />
        </div>
      </div>
    </div>
  );
}
