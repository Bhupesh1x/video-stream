import Link from "next/link";
import { useMemo } from "react";
import { formatDistanceToNow } from "date-fns";

import { UserInfo } from "@/features/users/components/UserInfo";

import { UserAvatar } from "@/components/UserAvatar";

import { VideosType } from "../types";
import { VideoThumbnail } from "./VideoThumbnail";

interface Props {
  video: VideosType["items"][number];
  onRemove?: () => void;
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
        <div className="flex gap-2">
          <Link href={`/users/${video.user.id}`}>
            <UserAvatar
              imageUrl={video.user?.imageUrl || ""}
              name={video.user?.name}
            />
          </Link>
          <div>
            <Link href={`/videos/${video.id}`}>
              <p
                className="text-lg font-semibold line-clamp-2"
                title={video.title}
              >
                {video.title}
              </p>
            </Link>
            <Link href={`/users/${video.user.id}`}>
              <UserInfo name={video?.user?.name || ""} />
            </Link>
            <Link href={`/videos/${video.id}`}>
              <p className="text-muted-foreground my-1">
                {compactViews} views • {compactDate ?? ""}
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
