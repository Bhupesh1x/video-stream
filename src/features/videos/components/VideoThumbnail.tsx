import Image from "next/image";

type Props = {
  title: string;
  previewUrl?: string | null;
  thumbnailImageUrl?: string | null;
};

export function VideoThumbnail({
  title,
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
          src={previewUrl ? previewUrl : "/images/placeholder.svg"}
          alt={title}
          className="h-full w-full object-contain bg-gray-200 opacity-0 group-hover:opacity-100"
        />
      </div>
    </div>
  );
}
