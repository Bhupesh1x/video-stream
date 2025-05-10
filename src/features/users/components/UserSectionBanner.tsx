"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Edit2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { BannerUploadModal } from "./BannerUploadModal";

import { UserType } from "../types";

type Props = {
  user: UserType;
};

export function UserSectionBanner({ user }: Props) {
  const auth = useAuth();

  const [isBannerUploadModalOpen, setIsBannerUploadModalOpen] = useState(false);

  function onClick() {
    setIsBannerUploadModalOpen(true);
  }

  return (
    <>
      <BannerUploadModal
        open={isBannerUploadModalOpen}
        onOpenChange={setIsBannerUploadModalOpen}
      />
      <div
        className={`group relative h-[15vh] md:h-[25vh] max-h-[200px] bg-gradient-to-r from-gray-100 to-gray-200 w-full rounded-xl ${
          user?.bannerUrl ? "bg-cover bg-center" : "bg-gray-100"
        }`}
        style={{
          backgroundImage: user?.bannerUrl
            ? `url(${user.bannerUrl})`
            : undefined,
        }}
      >
        {auth.userId === user.clerkId ? (
          <Button
            size="icon"
            className="bg-black/50 hover:bg-black/50 rounded-full opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2"
            onClick={onClick}
          >
            <Edit2Icon className="text-white fill-white size-4" />
          </Button>
        ) : null}
      </div>
    </>
  );
}
