import {
  Trash2Icon,
  MoreVerticalIcon,
  MessageSquareIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
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
import { CommentForm } from "./CommentForm";
import { CommentRepliesItem } from "./CommentRepliesItem";

type Props = {
  comment: Comments["items"][number];
  variant?: "comment" | "reply";
};

export function CommentItem({ comment, variant = "comment" }: Props) {
  const { openSignIn, isSignedIn } = useClerk();
  const { userId: clerkUserId } = useAuth();

  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [isRepliesOpen, setIsRepliesOpen] = useState(false);

  const utils = trpc.useUtils();
  const deleteComment = trpc.comments.remove.useMutation();

  const likeComment = trpc.commentReactions.like.useMutation();
  const dislikeComment = trpc.commentReactions.dislike.useMutation();

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

  function onLike() {
    if (!isSignedIn) {
      return openSignIn();
    }

    likeComment.mutate(
      { commentId: comment.id },
      {
        onSuccess: () => {
          utils.comments.getMany.invalidate({ videoId: comment.videoId });
        },
        onError: (error) => {
          toast.error("Failed to like comment");

          if (error?.data?.code === "UNAUTHORIZED") {
            openSignIn();
          }
        },
      }
    );
  }

  function onDisLike() {
    if (!isSignedIn) {
      return openSignIn();
    }

    dislikeComment.mutate(
      { commentId: comment.id },
      {
        onSuccess: () => {
          utils.comments.getMany.invalidate({ videoId: comment.videoId });
        },
        onError: (error) => {
          toast.error("Failed to dislike comment");

          if (error?.data?.code === "UNAUTHORIZED") {
            openSignIn();
          }
        },
      }
    );
  }

  function openReply() {
    setIsReplyOpen(true);
  }

  function closeReply() {
    setIsReplyOpen(false);
  }

  function onToogleReplies() {
    setIsRepliesOpen((prev) => !prev);
  }

  function onReplySaveSuccess() {
    setIsReplyOpen(false);
    setIsRepliesOpen(true);
  }

  return (
    <div>
      <div className="flex justify-between gap-2">
        <div className="flex gap-2">
          <UserAvatar
            size={variant === "comment" ? "lg" : "sm"}
            imageUrl={comment?.user?.imageUrl || "/images/user-placeholder.svg"}
            name={comment?.user?.name || "User"}
          />
          <div className="flex flex-col gap-[2px]">
            <div className="flex items-center gap-1 w-full">
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
                disabled={likeComment.isPending || dislikeComment.isPending}
                onClick={onLike}
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
                disabled={likeComment.isPending || dislikeComment.isPending}
                onClick={onDisLike}
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
              {variant === "comment" ? (
                <Button
                  size="sm"
                  variant="ghost"
                  className="size-8 min-w-14 font-semibold"
                  onClick={openReply}
                >
                  Reply
                </Button>
              ) : null}
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
            {variant === "comment" ? (
              <DropdownMenuItem onClick={openReply}>
                <MessageSquareIcon className="size-4 mr-2" />
                Reply
              </DropdownMenuItem>
            ) : null}
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
      {isReplyOpen && variant === "comment" ? (
        <div className="pl-14 mt-2">
          <CommentForm
            videoId={comment?.videoId || ""}
            onSuccess={onReplySaveSuccess}
            variant="reply"
            parentId={comment.id}
            closeReply={closeReply}
          />
        </div>
      ) : null}
      {variant === "comment" && comment?.repliesCount > 0 ? (
        <div className="pl-14">
          <Button size="sm" variant="tertiary" onClick={onToogleReplies}>
            {isRepliesOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}{" "}
            {comment.repliesCount} replies
          </Button>
        </div>
      ) : null}

      {isRepliesOpen ? (
        <CommentRepliesItem videoId={comment.videoId} parentId={comment.id} />
      ) : null}
    </div>
  );
}
