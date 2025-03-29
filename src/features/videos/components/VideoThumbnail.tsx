import Image from "next/image";

type Props = {
  thumbnailImageUrl?: string | null;
};

export function VideoThumbnail({ thumbnailImageUrl }: Props) {
  return (
    <div className="relative">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl">
        <Image
          fill
          src={
            thumbnailImageUrl ? thumbnailImageUrl : "/images/placeholder.svg"
          }
          alt="video-thumbnail"
          className="h-full w-full object-contain bg-gray-200"
        />
      </div>
    </div>
  );
}
