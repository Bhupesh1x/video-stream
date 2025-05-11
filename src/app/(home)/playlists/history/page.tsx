import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { DEFAULT_LIMIT } from "@/constants";
import { HydrateClient, trpc } from "@/trpc/server";

import { HistoryView } from "@/features/playlists/views/HistoryView";

async function HistoryPage() {
  const { userId } = await auth();

  void trpc.playlists.getHistory.prefetchInfinite({ limit: DEFAULT_LIMIT });

  if (!userId) {
    return redirect("/sign-in");
  }

  return (
    <HydrateClient>
      <HistoryView />
    </HydrateClient>
  );
}

export default HistoryPage;
