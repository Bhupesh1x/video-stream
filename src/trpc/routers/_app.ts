import { videoRouter } from "@/features/videos/server/procedures";
import { studioRouter } from "@/features/studio/server/procedures";
import { videoViewsRouter } from "@/features/videoViews/procedures";
import { commentsRouter } from "@/features/comments/server/procedures";
import { categoriesRouter } from "@/features/categories/server/procedures";
import { videoReactionsRouter } from "@/features/videoReactions/procedures";
import { subscriptionsRouter } from "@/features/subscriptions/server/procedures";

import { createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  video: videoRouter,
  studio: studioRouter,
  comments: commentsRouter,
  categories: categoriesRouter,
  videoViews: videoViewsRouter,
  subscriptions: subscriptionsRouter,
  videoReactions: videoReactionsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
