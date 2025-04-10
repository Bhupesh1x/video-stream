"use client";

import MuxPlayer from "@mux/mux-player-react";

type Props = {
  playbackId?: string | undefined | null;
  autoPlay?: boolean;
  onPlay?: () => void;
  thumbnailUrl?: string | undefined | null;
};

export function VideoPlayer({
  autoPlay,
  playbackId,
  thumbnailUrl,
  onPlay,
}: Props) {
  return (
    <MuxPlayer
      onPlay={onPlay}
      autoPlay={autoPlay}
      playbackId={playbackId || ""}
      accentColor="#0080ff"
      thumbnailTime={0}
      playerInitTime={0}
      className="h-full w-full object-contain"
      poster={thumbnailUrl ?? "/images/placeholder.svg"}
      onError={() => console.log("player error")}
    />
  );
}
