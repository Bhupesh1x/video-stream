import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { DEFAULT_LIMIT } from "@/constants";
import { HydrateClient, trpc } from "@/trpc/server";

import { LikedView } from "@/features/playlists/views/LikedView";

async function LikedPage() {
  const { userId } = await auth();
  void trpc.playlists.getLiked.prefetchInfinite({ limit: DEFAULT_LIMIT });

  if (!userId) {
    return redirect("/sign-in");
  }

  return (
    <HydrateClient>
      <LikedView />
    </HydrateClient>
  );
}

export default LikedPage;
