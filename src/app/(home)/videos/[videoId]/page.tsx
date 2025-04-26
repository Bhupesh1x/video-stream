import { DEFAULT_LIMIT } from "@/constants";
import { HydrateClient, trpc } from "@/trpc/server";

import { VideoIdView } from "@/features/videos/views/VideoIdView";

type Props = {
  params: Promise<{
    videoId: string;
  }>;
};

export const dynamic = "force-dynamic";

async function VideoIdPage({ params }: Props) {
  const { videoId } = await params;

  void trpc.video.getOne.prefetch({ videoId });
  void trpc.comments.getMany.prefetchInfinite({
    videoId,
    limit: DEFAULT_LIMIT,
  });
  void trpc.suggestions.getMany.prefetchInfinite({
    videoId,
    limit: DEFAULT_LIMIT,
  });

  return (
    <HydrateClient>
      <VideoIdView videoId={videoId} />
    </HydrateClient>
  );
}

export default VideoIdPage;
