import { DEFAULT_LIMIT } from "@/constants";
import { HydrateClient, trpc } from "@/trpc/server";

import { PlaylistIdView } from "@/features/playlists/views/PlaylistIdView";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    playlistId: string;
  }>;
};

async function PlaylistIdPage({ params }: Props) {
  const { playlistId } = await params;

  void trpc.playlists.getOnePlaylist.prefetch({ playlistId });
  void trpc.playlists.getCustomPlayistVideos.prefetchInfinite({
    playlistId,
    limit: DEFAULT_LIMIT,
  });

  return (
    <HydrateClient>
      <PlaylistIdView playlistId={playlistId} />
    </HydrateClient>
  );
}

export default PlaylistIdPage;
