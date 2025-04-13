import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { UTApi } from "uploadthing/server";
import { and, eq, getTableColumns, inArray } from "drizzle-orm";

import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { mux } from "@/lib/mux";
import { workflow } from "@/lib/workflow";

import {
  updateVideoSchema,
  users,
  videoReactions,
  videos,
  videoViews,
} from "@/db/schema";
import { db } from "@/db";

export const videoRouter = createTRPCRouter({
  create: protectedProcedure.mutation(async ({ ctx }) => {
    const { id: userId } = ctx.user;

    const upload = await mux.video.uploads.create({
      new_asset_settings: {
        playback_policy: ["public"],
        passthrough: userId,
        input: [
          {
            generated_subtitles: [
              {
                language_code: "en",
                name: "English",
              },
            ],
          },
        ],
      },
      cors_origin: "*",
    });

    const [video] = await db
      .insert(videos)
      .values({
        title: "Untitled",
        userId,
        muxStatus: "waiting",
        muxUploadId: upload.id,
      })
      .returning();

    return { video, url: upload.url };
  }),
  update: protectedProcedure
    .input(updateVideoSchema)
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;

      if (!input.id) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const [video] = await db
        .update(videos)
        .set({
          title: input.title,
          description: input.description,
          categoryId: input.categoryId,
          visibility: input.visibility,
        })
        .where(and(eq(videos.id, input.id), eq(videos.userId, userId)))
        .returning();

      if (!video) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return video;
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

      const [video] = await db
        .delete(videos)
        .where(and(eq(videos.id, id), eq(videos.userId, userId)))
        .returning();

      if (!video) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return video;
    }),
  restore: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { id } = input;

      const [existingVideo] = await db
        .select()
        .from(videos)
        .where(and(eq(videos.id, id), eq(videos.userId, userId)));

      if (!existingVideo) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (!existingVideo.muxPlaybackId) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      if (existingVideo.thumbnailFileKey) {
        const uatpi = new UTApi();

        uatpi.deleteFiles(existingVideo.thumbnailFileKey);

        await db
          .update(videos)
          .set({
            thumbnailUrl: null,
            thumbnailFileKey: null,
          })
          .where(and(eq(videos.id, input.id), eq(videos.userId, userId)));
      }

      const thumbnailUrl = `https://image.mux.com/${existingVideo.muxPlaybackId}/thumbnail.png`;

      const [updatedVideo] = await db
        .update(videos)
        .set({
          thumbnailUrl,
        })
        .where(and(eq(videos.id, input.id), eq(videos.userId, userId)))
        .returning();

      return updatedVideo;
    }),
  generateTitle: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { id } = input;

      const { workflowRunId } = await workflow.trigger({
        url: `${process.env.UPSTASH_WORKFLOW_URL}/api/videos/workflows/title`,
        body: {
          userId,
          videoId: id,
        },
      });

      return workflowRunId;
    }),
  generateDescription: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { id } = input;

      const { workflowRunId } = await workflow.trigger({
        url: `${process.env.UPSTASH_WORKFLOW_URL}/api/videos/workflows/description`,
        body: {
          userId,
          videoId: id,
        },
      });

      return workflowRunId;
    }),
  getOne: baseProcedure
    .input(
      z.object({
        videoId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { clerkUserId } = ctx;

      let userId;
      const [user] = await db
        .select({
          id: users.id,
        })
        .from(users)
        .where(inArray(users.clerkId, clerkUserId ? [clerkUserId] : []));

      if (user) {
        userId = user.id;
      }

      const viewerReaction = db.$with("video_reaction").as(
        db
          .select({
            videoId: videoReactions.videoId,
            type: videoReactions.type,
          })
          .from(videoReactions)
          .where(inArray(videoReactions.userId, userId ? [userId] : []))
      );

      const [existingVideo] = await db
        .with(viewerReaction)
        .select({
          ...getTableColumns(videos),
          user: {
            ...getTableColumns(users),
          },
          viewCount: db.$count(videoViews, eq(videoViews.videoId, videos.id)),
          likeCount: db.$count(
            videoReactions,
            and(
              eq(videoReactions.videoId, videos.id),
              eq(videoReactions.type, "like")
            )
          ),
          dislikeCount: db.$count(
            videoReactions,
            and(
              eq(videoReactions.videoId, videos.id),
              eq(videoReactions.type, "dislike")
            )
          ),
          viewerReaction: viewerReaction.type,
        })
        .from(videos)
        .innerJoin(users, eq(videos.userId, users.id))
        .leftJoin(viewerReaction, eq(viewerReaction.videoId, videos.id))
        .where(eq(videos.id, input.videoId));

      if (!existingVideo) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return existingVideo;
    }),
});
