"use client";

import { Loader2Icon, SquareCheckIcon, SquareIcon } from "lucide-react";

import { trpc } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/constants";

import { Button } from "@/components/ui/button";
import { InfiniteScroll } from "@/components/InfiniteScroll";
import { ResponsiveModal } from "@/components/ResponsiveModal";

type Props = {
  open: boolean;
  videoId: string;
  onOpenChange: (open: boolean) => void;
};

export function AddToPlaylistModal({ open, videoId, onOpenChange }: Props) {
  const {
    data: playlists,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = trpc.playlists.getManyForVideo.useInfiniteQuery(
    {
      limit: DEFAULT_LIMIT,
      videoId,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      enabled: open && !!videoId,
    }
  );

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title="Add to playlist"
    >
      <div className="w-full">
        {isLoading ? (
          <div className="flex justify-center p-4">
            <Loader2Icon className="size-5 text-muted-foreground animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {playlists?.pages
              ?.flatMap((page) => page?.items)
              ?.map((playlist) => (
                <Button
                  key={playlist.id}
                  variant="ghost"
                  size="lg"
                  className="justify-start [&_svg]:size-5 p-0 px-1"
                >
                  {playlist.containsVideo ? (
                    <SquareCheckIcon />
                  ) : (
                    <SquareIcon />
                  )}
                  <span>{playlist.name}</span>
                </Button>
              ))}
          </div>
        )}
        <InfiniteScroll
          isManual
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>
    </ResponsiveModal>
  );
}
