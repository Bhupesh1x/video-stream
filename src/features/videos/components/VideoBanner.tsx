import { AlertTriangle } from "lucide-react";

import { VideoWithUserInfo } from "../types";

type Props = {
  status: VideoWithUserInfo["muxStatus"];
};

export function VideoBanner({ status }: Props) {
  if (status === "ready") return null;

  return (
    <div className="bg-yellow-400 py-3 px-4 w-full rounded-b-xl flex items-center gap-x-2">
      <AlertTriangle className="size-4 text-black" />
      <p className="text-xs lg:text-sm font-semibold">
        This video is still being processed.
      </p>
    </div>
  );
}
