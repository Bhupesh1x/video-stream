"use client";

import { toast } from "sonner";
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

  const addVideo = trpc.playlists.addVideo.useMutation();
  const removeVideo = trpc.playlists.removeVideo.useMutation();

  const utils = trpc.useUtils();
  function onAddVideo(playlistId: string, videoId: string) {
    addVideo.mutate(
      { playlistId, videoId },
      {
        onSuccess: () => {
          toast.success("Video added to playlist");

          utils.playlists.getMany.invalidate();
          utils.playlists.getManyForVideo.invalidate({ videoId });
        },
        onError: () => {
          toast.success("Failed to add video to playlist");
        },
      }
    );
  }

  function onRemoveVideo(playlistId: string, videoId: string) {
    removeVideo.mutate(
      { playlistId, videoId },
      {
        onSuccess: () => {
          toast.success("Video removed from playlist");

          utils.playlists.getMany.invalidate();
          utils.playlists.getManyForVideo.invalidate({ videoId });
        },
        onError: () => {
          toast.success("Failed to remove video from playlist");
        },
      }
    );
  }

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
                  onClick={() => {
                    if (playlist.containsVideo) {
                      onRemoveVideo(playlist.id, videoId);
                    } else {
                      onAddVideo(playlist.id, videoId);
                    }
                  }}
                  disabled={addVideo.isPending || removeVideo.isPending}
                >
                  {playlist.containsVideo ? (
                    <SquareCheckIcon />
                  ) : (
                    <SquareIcon />
                  )}
                  <span>{playlist.name}</span>
                </Button>
              ))}

            <InfiniteScroll
              isManual
              hasNextPage={hasNextPage}
              fetchNextPage={fetchNextPage}
              isFetchingNextPage={isFetchingNextPage}
            />
          </div>
        )}
      </div>
    </ResponsiveModal>
  );
}
