import { VideoWithUserInfo } from "../types";

type Props = {
  video: VideoWithUserInfo;
};

export function VideoTopRow({ video }: Props) {
  return (
    <div className="mt-4">
      <h1 className="text-xl font-semibold">{video.title || " "}</h1>
    </div>
  );
}
