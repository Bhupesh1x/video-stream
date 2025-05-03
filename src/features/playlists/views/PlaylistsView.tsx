"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";

import { Heading } from "@/components/Heading";
import { Button } from "@/components/ui/button";

import { PlaylistsSection } from "../sections/PlaylistsSection";
import { CreatePlaylistModal } from "../components/CreatePlaylistModal";

export function PlaylistsView() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <CreatePlaylistModal open={isModalOpen} onOpenChange={setIsModalOpen} />
      <div className="max-w-[2400px] mx-auto mb-10 px-4 py-2.5 flex flex-col gap-y-6">
        <div className="flex items-center justify-between">
          <Heading
            title="Playlists"
            description="Collections you have created"
          />

          <Button
            variant="secondary"
            size="icon"
            onClick={() => setIsModalOpen(true)}
            className="rounded-full"
          >
            <PlusIcon className="!size-5" />
          </Button>
        </div>

        <PlaylistsSection />
      </div>
    </>
  );
}
