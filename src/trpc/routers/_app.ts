import { videoRouter } from "@/features/videos/server/procedures";
import { studioRouter } from "@/features/studio/server/procedures";
import { videoViewsRouter } from "@/features/videoViews/procedures";
import { categoriesRouter } from "@/features/categories/server/procedures";

import { createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  video: videoRouter,
  studio: studioRouter,
  categories: categoriesRouter,
  videoViews: videoViewsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
