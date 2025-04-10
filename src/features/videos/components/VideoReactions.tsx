import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export function VideoReactions() {
  const userReaction: "like" | "dislike" = "like";
  return (
    <div className="flex items-center border rounded-full">
      <Button
        variant="secondary"
        className="rounded-l-full rounded-r-none border-r border-neutral-400 hover:bg-gray-200 transition"
      >
        <ThumbsUpIcon
          className={`size-5 ${userReaction === "like" ? "fill-black" : ""}`}
        />
        {1}
      </Button>
      <Button
        variant="secondary"
        className="rounded-l-none rounded-r-full hover:bg-gray-200 transition"
      >
        <ThumbsDownIcon
          className={`size-5 ${userReaction !== "like" ? "fill-black" : ""}`}
        />
        {1}
      </Button>
    </div>
  );
}
