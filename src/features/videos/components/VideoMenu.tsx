import {
  ListPlusIcon,
  MoreVerticalIcon,
  ShareIcon,
  Trash2Icon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button, ButtonProps } from "@/components/ui/button";
import { toast } from "sonner";

type Props = {
  videoId: string;
  variant?: ButtonProps["variant"];
  onRemove?: () => void;
};

export function VideoMenu({ videoId, variant = "secondary", onRemove }: Props) {
  function onShare() {
    const fullUrl = `${
      process.env.VERCEL_URL || "http://localhost:3000"
    }/videos/${videoId}`;

    navigator.clipboard.writeText(fullUrl || "");

    toast.success("Link copied to the clipboard");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          className="border border-neutral-400 rounded-full hover:bg-gray-200 transition"
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
          onClick={() => {}}
          className=" hover:!bg-gray-200 transition"
        >
          <ListPlusIcon className="size-4 mr-2" />
          Add to playlist
        </DropdownMenuItem>
        {onRemove ? (
          <DropdownMenuItem
            onClick={() => {}}
            className=" hover:!bg-gray-200 transition"
          >
            <Trash2Icon className="size-4 mr-2" />
            Remove
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
