import { trpc } from "@/trpc/client";

import { UploadDropzone } from "@/lib/uploadthing";

import { ResponsiveModal } from "@/components/ResponsiveModal";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type Response = {
  serverData: {
    uploadedBy: string;
  };
};

export function BannerUploadModal({ open, onOpenChange }: Props) {
  const utils = trpc.useUtils();

  function onUploadComplete(res: Response[]) {
    utils.user.getOne.invalidate({ id: res?.[0].serverData.uploadedBy });

    onOpenChange(false);
  }

  return (
    <ResponsiveModal
      title="Upload a banner"
      open={open}
      onOpenChange={onOpenChange}
    >
      <UploadDropzone
        endpoint="bannerUploader"
        onClientUploadComplete={onUploadComplete}
      />
    </ResponsiveModal>
  );
}
