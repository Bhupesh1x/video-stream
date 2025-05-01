import { videoRouter } from "@/features/videos/server/procedures";
import { studioRouter } from "@/features/studio/server/procedures";
import { searchRouter } from "@/features/search/server/procedures";
import { videoViewsRouter } from "@/features/videoViews/procedures";
import { commentsRouter } from "@/features/comments/server/procedures";
import { playlistsRouter } from "@/features/playlists/server/procedure";
import { categoriesRouter } from "@/features/categories/server/procedures";
import { videoReactionsRouter } from "@/features/videoReactions/procedures";
import { suggestionRouter } from "@/features/suggestions/server/procedures";
import { commentReactionsRouter } from "@/features/commentReactions/procedures";
import { subscriptionsRouter } from "@/features/subscriptions/server/procedures";

import { createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  video: videoRouter,
  studio: studioRouter,
  search: searchRouter,
  comments: commentsRouter,
  playlists: playlistsRouter,
  categories: categoriesRouter,
  videoViews: videoViewsRouter,
  suggestions: suggestionRouter,
  subscriptions: subscriptionsRouter,
  videoReactions: videoReactionsRouter,
  commentReactions: commentReactionsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
