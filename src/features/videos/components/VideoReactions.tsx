import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";

import { trpc } from "@/trpc/client";

import { Button } from "@/components/ui/button";

import { VideoWithUserInfo } from "../types";

type Props = {
  likes: number;
  videoId: string;
  dislikes: number;
  viewerReaction: VideoWithUserInfo["viewerReaction"];
};

export function VideoReactions({
  likes,
  videoId,
  dislikes,
  viewerReaction,
}: Props) {
  const utils = trpc.useUtils();

  const likeVideo = trpc.videoReactions.like.useMutation();
  const dislikeVideo = trpc.videoReactions.dislike.useMutation();

  function onLike() {
    likeVideo.mutate(
      { videoId },
      {
        onSettled: () => {
          utils.video.getOne.invalidate({ videoId });
        },
      }
    );
  }

  function onDislike() {
    dislikeVideo.mutate(
      { videoId },
      {
        onSettled: () => {
          utils.video.getOne.invalidate({ videoId });
        },
      }
    );
  }

  return (
    <div className="flex items-center border rounded-full">
      <Button
        onClick={onLike}
        disabled={likeVideo.isPending || dislikeVideo.isPending}
        variant="secondary"
        className="rounded-l-full rounded-r-none border-r border-neutral-400 hover:bg-gray-200 transition"
      >
        <ThumbsUpIcon
          className={`size-5 ${viewerReaction === "like" ? "fill-black" : ""}`}
        />
        {likes}
      </Button>
      <Button
        onClick={onDislike}
        disabled={likeVideo.isPending || dislikeVideo.isPending}
        variant="secondary"
        className="rounded-l-none rounded-r-full hover:bg-gray-200 transition"
      >
        <ThumbsDownIcon
          className={`size-5 ${
            viewerReaction === "dislike" ? "fill-black" : ""
          }`}
        />
        {dislikes}
      </Button>
    </div>
  );
}
