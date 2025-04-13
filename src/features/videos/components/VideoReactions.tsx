import { useClerk } from "@clerk/nextjs";
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
  const { isSignedIn, openSignIn } = useClerk();

  const likeVideo = trpc.videoReactions.like.useMutation();
  const dislikeVideo = trpc.videoReactions.dislike.useMutation();

  function onLike() {
    if (!isSignedIn) {
      return openSignIn();
    }

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
    if (!isSignedIn) {
      return openSignIn();
    }

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
