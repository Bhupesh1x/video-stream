"use client";

import { useAuth } from "@clerk/nextjs";
import { Suspense, useMemo } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { format, formatDistanceToNow } from "date-fns";

import { trpc } from "@/trpc/client";

import { VideoPlayer } from "../components/VideoPlayer";
import { VideoBanner } from "../components/VideoBanner";
import { VideoTopRow } from "../components/VideoTopRow";
import { VideoDescription } from "../components/VideoDescription";

type Props = {
  videoId: string;
};

export function VideoSectionSuspense({ videoId }: Props) {
  const { isSignedIn } = useAuth();
  const utils = trpc.useUtils();

  const [video] = trpc.video.getOne.useSuspenseQuery({ videoId });

  const createVideoView = trpc.videoViews.create.useMutation();

  const compactViews = useMemo(() => {
    return Intl.NumberFormat("en", {
      notation: "compact",
    }).format(video.viewCount);
  }, [video.viewCount]);

  const expandedViews = useMemo(() => {
    return Intl.NumberFormat("en", {
      notation: "standard",
    }).format(video.viewCount);
  }, [video.viewCount]);

  const compactDate = useMemo(() => {
    return formatDistanceToNow(video.createdAt, { addSuffix: true });
  }, [video.createdAt]);

  const expandedDate = useMemo(() => {
    return format(video.createdAt, "d MMM yyyy");
  }, [video.createdAt]);

  function onPlay() {
    if (!isSignedIn) return;

    createVideoView.mutate(
      { videoId },
      {
        onSuccess: () => {
          utils.video.getOne.invalidate({ videoId });
        },
      }
    );
  }

  return (
    <div className="mb-4">
      <div
        className={`aspect-video bg-black overflow-hidden relative rounded-xl ${
          video.muxStatus !== "ready" ? "rounded-b-none" : ""
        }`}
      >
        <VideoPlayer
          playbackId={video.muxPlaybackId}
          autoPlay
          onPlay={onPlay}
          thumbnailUrl={video.thumbnailUrl}
        />
      </div>
      <VideoBanner status={video.muxStatus} />
      <div className="mt-6 space-y-6">
        <VideoTopRow video={video} />
        <VideoDescription
          description={video?.description || ""}
          compactViews={compactViews}
          compactDate={compactDate}
          expandedViews={expandedViews}
          expandedDate={expandedDate}
        />
      </div>
    </div>
  );
}

export function VideoSectionSkeleton() {
  return <p>Loading...</p>;
}

export function VideoSection({ videoId }: Props) {
  return (
    <Suspense fallback={<VideoSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <VideoSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
}
