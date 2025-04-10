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

type Props = {
  variant?: ButtonProps["variant"];
  onRemove?: () => void;
};

export function VideoMenu({ variant = "secondary", onRemove }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          className="border border-neutral-400 rounded-full"
          size="icon"
        >
          <MoreVerticalIcon className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
        <DropdownMenuItem onClick={() => {}}>
          <ShareIcon className="size-4 mr-2" />
          Share
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {}}>
          <ListPlusIcon className="size-4 mr-2" />
          Add to playlist
        </DropdownMenuItem>
        {onRemove ? (
          <DropdownMenuItem onClick={() => {}}>
            <Trash2Icon className="size-4 mr-2" />
            Remove
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
