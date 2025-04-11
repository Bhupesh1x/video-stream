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
      <h1 className="text-xl font-semibold line-clamp-2" title={video.title}>
        {video.title || " "}
      </h1>

      <div className="flex flex-col lg:flex-row justify-between gap-3">
        <VideoOwner user={video?.user} videoId={video.id} />

        <div className="flex items-center justify-between gap-2">
          <VideoReactions />
          <VideoMenu videoId={video.id} />
        </div>
      </div>
    </div>
  );
}
