"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2Icon, PlusIcon } from "lucide-react";

import { trpc } from "@/trpc/client";

import { Button } from "@/components/ui/button";
import { ResponsiveModal } from "@/components/ResponsiveModal";

import { StudioUploader } from "./StudioUploader";

export function StudioUploadButton() {
  const router = useRouter();

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

  function onSuccess() {
    if (!create?.data?.video?.id) return;

    create.reset();
    router.push(`/studio/videos/${create?.data?.video?.id}`);
  }

  return (
    <>
      <ResponsiveModal
        open={!!create?.data?.url}
        onOpenChange={() => create.reset()}
        title="Upload a video"
      >
        <StudioUploader endpoint={create?.data?.url} onSuccess={onSuccess} />
      </ResponsiveModal>
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
    </>
  );
}
