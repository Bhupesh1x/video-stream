import { VideoFormSection } from "../../sections/VideoFormSection";

type Props = {
  videoId: string;
};

export function VideoView({ videoId }: Props) {
  return (
    <div className="max-w-screen-lg pt-2.5 px-4">
      <VideoFormSection videoId={videoId} />
    </div>
  );
}
