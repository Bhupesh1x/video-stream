import {
  ListPlusIcon,
  MoreVerticalIcon,
  ShareIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

import { APP_URL } from "@/constants";

import { AddToPlaylistModal } from "@/features/playlists/components/AddToPlaylistModal";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button, ButtonProps } from "@/components/ui/button";
import { useAuth, useClerk } from "@clerk/nextjs";

type Props = {
  videoId: string;
  variant?: ButtonProps["variant"];
  onRemove?: () => void;
};

export function VideoMenu({ videoId, variant = "secondary", onRemove }: Props) {
  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();

  const [isAddPlaylistModalOpen, setIsAddPlaylistModalOpen] = useState(false);

  function onShare() {
    const fullUrl = `${APP_URL}/videos/${videoId}`;

    navigator.clipboard.writeText(fullUrl || "");

    toast.success("Link copied to the clipboard");
  }

  function onAddToPlaylistClick() {
    if (!isSignedIn) {
      return openSignIn();
    }

    setIsAddPlaylistModalOpen(true);
  }

  return (
    <>
      <AddToPlaylistModal
        videoId={videoId}
        open={isAddPlaylistModalOpen}
        onOpenChange={setIsAddPlaylistModalOpen}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={variant}
            className="rounded-full hover:bg-gray-200 transition shrink-0"
            size="icon"
          >
            <MoreVerticalIcon className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
          <DropdownMenuItem
            onClick={onShare}
            className=" hover:!bg-gray-200 transition"
          >
            <ShareIcon className="size-4 mr-2" />
            Share
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onAddToPlaylistClick}
            className=" hover:!bg-gray-200 transition"
          >
            <ListPlusIcon className="size-4 mr-2" />
            Add to playlist
          </DropdownMenuItem>
          {onRemove ? (
            <DropdownMenuItem
              onClick={onRemove}
              className=" hover:!bg-gray-200 transition"
            >
              <Trash2Icon className="size-4 mr-2" />
              Remove
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
