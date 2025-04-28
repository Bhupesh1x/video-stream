import Image from "next/image";

import { formatDuration } from "@/lib/utils";

type Props = {
  title: string;
  duration?: number;
  previewUrl?: string | null;
  thumbnailImageUrl?: string | null;
};

export function VideoThumbnail({
  title,
  duration,
  previewUrl,
  thumbnailImageUrl,
}: Props) {
  return (
    <div className="relative">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl group">
        <Image
          fill
          src={
            thumbnailImageUrl ? thumbnailImageUrl : "/images/placeholder.svg"
          }
          alt={title}
          className="h-full w-full object-contain bg-gray-200 group-hover:opacity-0"
        />

        <Image
          fill
          unoptimized={!!previewUrl}
          src={previewUrl ? previewUrl : "/images/placeholder.svg"}
          alt={title}
          className="h-full w-full object-contain bg-gray-200 opacity-0 group-hover:opacity-100"
        />

        <div className="bg-black/80 py-0.5 px-1 absolute bottom-2 right-2 text-white text-xs font-medium rounded">
          {formatDuration(duration ?? 0)}
        </div>
      </div>
    </div>
  );
}
