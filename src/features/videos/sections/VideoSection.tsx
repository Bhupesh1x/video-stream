"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { trpc } from "@/trpc/client";

import { VideoPlayer } from "../components/VideoPlayer";
import { VideoBanner } from "../components/VideoBanner";
import { VideoTopRow } from "../components/VideoTopRow";

type Props = {
  videoId: string;
};

export function VideoSectionSuspense({ videoId }: Props) {
  const [video] = trpc.video.getOne.useSuspenseQuery({ videoId });

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
          onPlay={() => {}}
          thumbnailUrl={video.thumbnailUrl}
        />
      </div>
      <VideoBanner status={video.muxStatus} />
      <VideoTopRow video={video} />
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
