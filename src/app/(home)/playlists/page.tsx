import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { DEFAULT_LIMIT } from "@/constants";
import { HydrateClient, trpc } from "@/trpc/server";

import { PlaylistsView } from "@/features/playlists/views/PlaylistsView";

async function PlaylistsPage() {
  const { userId } = await auth();

  void trpc.playlists.getMany.prefetchInfinite({ limit: DEFAULT_LIMIT });

  if (!userId) {
    return redirect("/sign-in");
  }

  return (
    <HydrateClient>
      <PlaylistsView />
    </HydrateClient>
  );
}

export default PlaylistsPage;
