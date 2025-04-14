import { z } from "zod";
import { eq } from "drizzle-orm";

import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";

import { db } from "@/db";
import { comments } from "@/db/schema";

export const commentsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        videoId: z.string().uuid(),
        value: z.string().trim().min(1, "Required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { value, videoId } = input;

      const [createdComment] = await db
        .insert(comments)
        .values({
          userId,
          videoId,
          value,
        })
        .returning();

      return createdComment;
    }),
  getMany: baseProcedure
    .input(
      z.object({
        videoId: z.string().uuid(),
      })
    )
    .query(async ({ input }) => {
      const { videoId } = input;

      const data = await db
        .select()
        .from(comments)
        .where(eq(comments.videoId, videoId));

      return data;
    }),
});
