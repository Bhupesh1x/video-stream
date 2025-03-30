import { HydrateClient, trpc } from "@/trpc/server";

import { VideoView } from "@/features/studio/components/views/VideoView";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ videoId: string }>;
};

async function VideoIdPage({ params }: Props) {
  const { videoId } = await params;

  void trpc.studio.getOne.prefetch({ id: videoId });
  void trpc.categories.getMany.prefetch();

  return (
    <HydrateClient>
      <VideoView videoId={videoId} />
    </HydrateClient>
  );
}

export default VideoIdPage;
