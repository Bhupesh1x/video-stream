import {
  Trash2Icon,
  MoreVerticalIcon,
  MessageSquareIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { useAuth, useClerk } from "@clerk/nextjs";

import { trpc } from "@/trpc/client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/UserAvatar";

import { Comments } from "../types";

type Props = {
  comment: Comments["items"][number];
};

export function CommentItem({ comment }: Props) {
  const { openSignIn } = useClerk();
  const { userId: clerkUserId } = useAuth();

  const utils = trpc.useUtils();
  const deleteComment = trpc.comments.remove.useMutation();

  function onDelete() {
    deleteComment.mutate(
      { id: comment.id },
      {
        onSuccess: () => {
          toast.success("Comment deleted");

          utils.comments.getMany.invalidate({ videoId: comment.videoId });
        },
        onError: (error) => {
          toast.error("Failed to delete comment");

          if (error.data?.code === "UNAUTHORIZED") {
            openSignIn();
          }
        },
      }
    );
  }

  return (
    <div>
      <div className="flex justify-between gap-2">
        <div className="flex gap-2">
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
            <div className="flex items-center gap-1">
              <Button
                size="icon"
                variant="ghost"
                disabled={false}
                onClick={() => {}}
                className="size-8"
              >
                <ThumbsUpIcon
                  className={`${
                    comment?.viewerReaction === "like" ? "fill-black" : ""
                  } `}
                />
              </Button>
              <span className="text-sm text-muted-foreground">
                {comment?.likeCount || 0}
              </span>
              <Button
                size="icon"
                variant="ghost"
                disabled={false}
                onClick={() => {}}
                className="size-8"
              >
                <ThumbsDownIcon
                  className={`${
                    comment?.viewerReaction === "dislike" ? "fill-black" : ""
                  } `}
                />
              </Button>
              <span className="text-sm text-muted-foreground">
                {comment?.dislikeCount || 0}
              </span>
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" className="size-8 shrink-0">
              <MoreVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <MessageSquareIcon className="size-4 mr-2" />
              Reply
            </DropdownMenuItem>
            {comment?.user?.clerkId === clerkUserId ? (
              <DropdownMenuItem
                onClick={onDelete}
                disabled={deleteComment.isPending}
              >
                <Trash2Icon className="size-4 mr-2" />
                Delete
              </DropdownMenuItem>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
