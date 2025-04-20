import {
  and,
  count,
  desc,
  eq,
  getTableColumns,
  inArray,
  isNotNull,
  isNull,
  lt,
  or,
} from "drizzle-orm";
import { z } from "zod";

import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";

import { db } from "@/db";
import { commentReactions, comments, users } from "@/db/schema";

export const commentsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        videoId: z.string().uuid(),
        parentId: z.string().uuid().nullish(),
        value: z.string().trim().min(1, "Required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { value, videoId, parentId } = input;

      if (parentId) {
        const [existingComment] = await db
          .select()
          .from(comments)
          .where(and(inArray(comments.id, parentId ? [parentId] : [])));

        if (!existingComment && parentId) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }

        if (existingComment?.parentId && parentId) {
          throw new TRPCError({ code: "BAD_REQUEST" });
        }
      }

      const [createdComment] = await db
        .insert(comments)
        .values({
          userId,
          videoId,
          value,
          parentId,
        })
        .returning();

      return createdComment;
    }),
  getMany: baseProcedure
    .input(
      z.object({
        videoId: z.string().uuid(),
        parentId: z.string().uuid().nullish(),
        cursor: z
          .object({
            id: z.string().uuid(),
            updatedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100),
      })
    )
    .query(async ({ input, ctx }) => {
      const { clerkUserId } = ctx;
      const { videoId, limit, cursor, parentId } = input;

      const [user] = await db
        .select()
        .from(users)
        .where(inArray(users.clerkId, clerkUserId ? [clerkUserId] : []));

      let userId;

      if (user) {
        userId = user.id;
      }

      const viewerReactions = db.$with("viewer_reaction").as(
        db
          .select({
            type: commentReactions.type,
            commentId: commentReactions.commentId,
          })
          .from(commentReactions)
          .where(inArray(commentReactions.userId, userId ? [userId] : []))
      );

      const replies = db.$with("replies").as(
        db
          .select({
            parentId: comments.parentId,
            count: count(comments.id).as("count"),
          })
          .from(comments)
          .where(isNotNull(comments.parentId))
          .groupBy(comments.parentId)
      );

      const totalCountPromise = db
        .select({ count: count() })
        .from(comments)
        .where(and(eq(comments.videoId, videoId), isNull(comments.parentId)));

      const dataPromise = db
        .with(viewerReactions, replies)
        .select({
          ...getTableColumns(comments),
          user: users,
          viewerReaction: viewerReactions.type,
          likeCount: db.$count(
            commentReactions,
            and(
              eq(commentReactions.type, "like"),
              eq(commentReactions.commentId, comments.id)
            )
          ),
          dislikeCount: db.$count(
            commentReactions,
            and(
              eq(commentReactions.type, "dislike"),
              eq(commentReactions.commentId, comments.id)
            )
          ),
          repliesCount: replies.count,
        })
        .from(comments)
        .where(
          and(
            eq(comments.videoId, videoId),
            parentId
              ? eq(comments.parentId, parentId)
              : isNull(comments.parentId),
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
        .leftJoin(viewerReactions, eq(comments.id, viewerReactions.commentId))
        .leftJoin(replies, eq(replies.parentId, comments.id))
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

  remove: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { id } = input;

      const [deletedComment] = await db
        .delete(comments)
        .where(and(eq(comments.id, id), eq(comments.userId, userId)))
        .returning();

      if (!deletedComment) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return deletedComment;
    }),
});
