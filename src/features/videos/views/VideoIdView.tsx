import { VideoSection } from "../sections/VideoSection";

type Props = {
  videoId: string;
};

export function VideoIdView({ videoId }: Props) {
  return (
    <div className="pt-2.5 px-4 max-w-[1700px] mx-auto">
      <VideoSection videoId={videoId} />
    </div>
  );
}
