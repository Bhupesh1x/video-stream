import Link from "next/link";

import { Skeleton } from "@/components/ui/skeleton";

import { PlaylistInfo } from "./PlaylistInfo";
import { PlaylistThumbnail } from "./PlaylistThumbnail";

import { PlaylistsType } from "../../types";

type Props = {
  playlist: PlaylistsType["items"][number];
};

export function PlaylistGridCardSkeleton() {
  return (
    <div className="space-y-2">
      <div className="pt-3">
        <div className="w-full overflow-hidden aspect-video rounded-xl">
          <Skeleton className="size-full" />
        </div>
        <div className="space-y-2 py-2">
          <Skeleton className="h-[20px] w-[80%]" />
          <Skeleton className="h-[20px] w-[65%]" />
          <Skeleton className="h-[20px] w-[50%]" />
        </div>
      </div>
    </div>
  );
}

export function PlaylistGridCard({ playlist }: Props) {
  return (
    <Link prefetch href={`/playlists/${playlist.id}`}>
      <div className="group space-y-2">
        <PlaylistThumbnail playlist={playlist} />
        <PlaylistInfo playlist={playlist} />
      </div>
    </Link>
  );
}
