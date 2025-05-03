import Image from "next/image";
import { useMemo } from "react";
import { ListVideoIcon, PlayIcon } from "lucide-react";

import { PlaylistsType } from "../../types";

type Props = {
  playlist: PlaylistsType["items"][number];
  className?: string;
};

export function PlaylistThumbnail({ playlist, className }: Props) {
  const compactViews = useMemo(() => {
    return Intl.NumberFormat("en", {
      notation: "compact",
    }).format(playlist?.playlistVideosCount ?? 0);
  }, [playlist?.playlistVideosCount]);

  return (
    <div className={`relative pt-3 ${className}`}>
      <div className="relative">
        {/* Background layers */}
        <div className="aspect-video absolute -top-3 bg-black/20 left-1/2 -translate-x-1/2 w-[97%] rounded-xl" />
        <div className="aspect-video absolute -top-1.5 bg-black/25 left-1/2 -translate-x-1/2 w-[98.5%] rounded-xl" />

        {/* Main image */}
        <div className="relative aspect-video overflow-hidden rounded-xl w-full">
          <Image
            fill
            src={"/images/placeholder.svg"}
            alt={playlist.name}
            className="w-full h-full object-cover"
          />

          {/* Hover layer */}

          <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer gap-2">
            <PlayIcon className="text-white fill-white size-4" />
            <p className="text-white font-medium">Play all</p>
          </div>
        </div>
      </div>

      {/* Video count indicator */}
      <div className="absolute bottom-2 right-2 bg-black/80 text-white rounded flex items-center gap-1 py-0.5 px-1 text-xs font-medium">
        <ListVideoIcon className="size-4" />
        <p>{compactViews} videos</p>
      </div>
    </div>
  );
}
