import { DEFAULT_LIMIT } from "@/constants";
import { HydrateClient, trpc } from "@/trpc/server";

import { UserView } from "@/features/users/views/UserView";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    userId: string;
  }>;
};

async function UsersPage({ params }: Props) {
  const { userId } = await params;

  void trpc.user.getOne.prefetch({ id: userId });
  void trpc.video.getMany.prefetch({ userId, limit: DEFAULT_LIMIT });

  return (
    <HydrateClient>
      <UserView userId={userId} />
    </HydrateClient>
  );
}

export default UsersPage;
