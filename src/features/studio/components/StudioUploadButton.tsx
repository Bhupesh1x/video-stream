"use client";

import { toast } from "sonner";
import { Loader2Icon, PlusIcon } from "lucide-react";

import { trpc } from "@/trpc/client";

import { Button } from "@/components/ui/button";

export function StudioUploadButton() {
  const utils = trpc.useUtils();
  const create = trpc.video.create.useMutation({
    onSuccess: () => {
      toast.success("Video created");
      utils.studio.getMany.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create video");
    },
  });

  return (
    <Button
      variant="secondary"
      onClick={() => create.mutate()}
      disabled={create.isPending}
    >
      {create.isPending ? (
        <Loader2Icon className="animate-spin" />
      ) : (
        <PlusIcon />
      )}
      <span>Create</span>
    </Button>
  );
}
