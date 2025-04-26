import Link from "next/link";

import { UserInfo } from "@/features/users/components/UserInfo";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserAvatar } from "@/components/UserAvatar";

import { VideoMenu } from "./VideoMenu";
import { VideoThumbnail } from "./VideoThumbnail";

import { VideosType } from "../types";
import { useMemo } from "react";

interface Props {
  video: VideosType["items"][number];
  onRemove?: () => void;
  variant?: "default" | "compact";
}

export function VideoRowCard({ video, variant = "default" }: Props) {
  const compactViews = useMemo(() => {
    return Intl.NumberFormat("en", {
      notation: "compact",
    }).format(video?.viewsCount ?? 0);
  }, [video?.viewsCount]);

  const compactLikes = useMemo(() => {
    return Intl.NumberFormat("en", {
      notation: "compact",
    }).format(video?.likeCount ?? 0);
  }, [video?.likeCount]);

  return (
    <div
      className={`group flex w-full min-w-0 ${
        variant === "default" ? "gap-4" : "gap-2"
      }`}
    >
      <Link
        href={`/videos/${video.id}`}
        className={`reative ${variant === "default" ? "w-[68%]" : "w-[80%]"}`}
      >
        <VideoThumbnail
          title={video.title}
          duration={video?.duration ?? 0}
          previewUrl={video.previewUrl}
          thumbnailImageUrl={video.thumbnailUrl}
        />
      </Link>
      <div className="flex justify-between gap-2 w-full">
        <Link href={`/videos/${video.id}`}>
          <div>
            <h3
              className={`font-semibold line-clamp-2 ${
                variant === "compact" ? "size-sm" : "size-base"
              }`}
            >
              {video?.title || "Title"}
            </h3>
            {variant === "default" ? (
              <p className="text-xs text-muted-foreground my-1">
                {video?.viewsCount ?? 0} views • {video?.likeCount ?? 0} likes
              </p>
            ) : null}
            {variant === "default" ? (
              <>
                <div className="flex items-center gap-x-2">
                  <UserAvatar
                    imageUrl={video?.user?.imageUrl || ""}
                    name={video?.user?.name || ""}
                    size="sm"
                  />
                  <p
                    className="text-sm text-muted-foreground line-clamp-1"
                    title={video?.user?.name}
                  >
                    {video?.user?.name || ""}
                  </p>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-xs text-muted-foreground w-fit line-clamp-2 mt-2">
                      {video?.description ?? "No description"}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    align="center"
                    className="bg-black/70"
                  >
                    From the video description
                  </TooltipContent>
                </Tooltip>
              </>
            ) : null}
            {variant === "compact" ? (
              <UserInfo name={video?.user?.name || "User"} size="sm" />
            ) : null}
            {variant === "compact" ? (
              <p className="text-sm text-muted-foreground">
                {compactViews} views • {compactLikes} likes
              </p>
            ) : null}
          </div>
        </Link>
        <VideoMenu videoId={video.id} onRemove={() => {}} />
      </div>
    </div>
  );
}
