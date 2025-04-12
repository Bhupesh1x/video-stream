import { z } from "zod";
import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { users, videos, videoViews } from "@/db/schema";

import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const videoViewsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ videoId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { videoId } = input;

      const [existingVideoView] = await db
        .select()
        .from(videoViews)
        .where(and(eq(videos.id, videoId), eq(users.id, userId)));

      if (existingVideoView) {
        return existingVideoView;
      }

      const [videoView] = await db
        .insert(videoViews)
        .values({
          userId,
          videoId,
        })
        .returning();

      return videoView;
    }),
});
