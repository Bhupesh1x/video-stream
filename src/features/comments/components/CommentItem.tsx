import { formatDistanceToNow } from "date-fns";
import { MoreHorizontalIcon } from "lucide-react";

import { UserAvatar } from "@/components/UserAvatar";

import { Comments } from "../types";

type Props = {
  comment: Comments[number];
};

export function CommentItem({ comment }: Props) {
  return (
    <div>
      <div className="flex justify-between gap-2">
        <div className="flex items-center gap-2">
          <UserAvatar
            size="lg"
            imageUrl={comment?.user?.imageUrl || "/images/user-placeholder.svg"}
            name={comment?.user?.name || "User"}
          />
          <div className="flex flex-col gap-[2px]">
            <div className="flex items-center gap-1">
              <p className="text-sm font-semibold">
                {comment?.user?.name || "User"}{" "}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
              </p>
            </div>
            <p>{comment?.value || ""}</p>
          </div>
        </div>
        <MoreHorizontalIcon />
      </div>
    </div>
  );
}
