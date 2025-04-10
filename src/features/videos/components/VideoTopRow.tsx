import { VideoMenu } from "./VideoMenu";
import { VideoOwner } from "./VideoOwner";
import { VideoReactions } from "./VideoReactions";

import { VideoWithUserInfo } from "../types";

type Props = {
  video: VideoWithUserInfo;
};

export function VideoTopRow({ video }: Props) {
  return (
    <div className="mt-4 space-y-4">
      <h1 className="text-xl font-semibold">{video.title || " "}</h1>

      <div className="flex justify-between">
        <VideoOwner user={video?.user} videoId={video.id} />

        <div className="flex items-center gap-2">
          <VideoReactions />
          <VideoMenu videoId={video.id} />
        </div>
      </div>
    </div>
  );
}
