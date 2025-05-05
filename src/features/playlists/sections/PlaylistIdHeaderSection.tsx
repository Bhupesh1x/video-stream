"use client";

import { toast } from "sonner";
import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { Trash2Icon } from "lucide-react";
import { ErrorBoundary } from "react-error-boundary";

import { trpc } from "@/trpc/client";

import { Heading } from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  playlistId: string;
};

function PlaylistIdHeaderSectionSuspense({ playlistId }: Props) {
  const [playlist] = trpc.playlists.getOnePlaylist.useSuspenseQuery({
    playlistId,
  });

  const removePlaylist = trpc.playlists.remove.useMutation();

  const router = useRouter();
  const utils = trpc.useUtils();

  function onRemovePlaylist() {
    removePlaylist.mutate(
      { playlistId },
      {
        onSuccess: () => {
          toast.success("Playlist deleted");
          utils.playlists.getMany.invalidate();
          router.replace("/playlists");
        },
        onError: () => {
          toast.error("Failed to delete playlist");
        },
      }
    );
  }

  return (
    <div className="flex items-center justify-between">
      <Heading
        title={playlist?.name || "Custom Playlist"}
        description="Videos from the playlist"
      />
      <Button
        variant="outline"
        size="icon"
        className="rounded-full"
        onClick={onRemovePlaylist}
        disabled={removePlaylist.isPending}
      >
        <Trash2Icon />
      </Button>
    </div>
  );
}

function PlaylistIdHeaderSectionSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-[32px] w-40" />
      <Skeleton className="h-[16px] w-48" />
    </div>
  );
}

export function PlaylistIdHeaderSection(props: Props) {
  return (
    <Suspense fallback={<PlaylistIdHeaderSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <PlaylistIdHeaderSectionSuspense {...props} />
      </ErrorBoundary>
    </Suspense>
  );
}
