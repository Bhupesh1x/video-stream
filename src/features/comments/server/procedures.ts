import { z } from "zod";
import { and, count, desc, eq, getTableColumns, lt, or } from "drizzle-orm";

import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";

import { db } from "@/db";
import { comments, users } from "@/db/schema";

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
        cursor: z
          .object({
            id: z.string().uuid(),
            updatedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100),
      })
    )
    .query(async ({ input }) => {
      const { videoId, limit, cursor } = input;

      const totalCountPromise = db
        .select({ count: count() })
        .from(comments)
        .where(eq(comments.videoId, videoId));

      const dataPromise = db
        .select({
          ...getTableColumns(comments),
          user: users,
        })
        .from(comments)
        .where(
          and(
            eq(comments.videoId, videoId),
            cursor
              ? or(
                  lt(comments.updatedAt, cursor.updatedAt),
                  and(
                    eq(comments.updatedAt, cursor.updatedAt),
                    lt(comments.id, cursor.id)
                  )
                )
              : undefined
          )
        )
        .innerJoin(users, eq(comments.userId, users.id))
        .orderBy(desc(comments.updatedAt), desc(comments.id))
        .limit(limit + 1);

      const [totalCountResult, dataResult] = await Promise.allSettled([
        totalCountPromise,
        dataPromise,
      ]);

      if (dataResult.status !== "fulfilled") {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }

      let totalCount = { count: 0 };
      if (totalCountResult.status === "fulfilled") {
        totalCount = totalCountResult?.value?.[0] ?? { count: 0 };
      }

      const data = dataResult?.value ?? [];

      const hasMoreData = data?.length > limit;
      const items = hasMoreData ? data.slice(0, -1) : data;
      const lastItem = items[items?.length - 1];

      const nextCursor = hasMoreData
        ? {
            id: lastItem.id,
            updatedAt: lastItem.updatedAt,
          }
        : null;

      return {
        totalCount: totalCount.count,
        items,
        nextCursor,
      };
    }),
});
