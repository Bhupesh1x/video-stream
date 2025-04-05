import { and, eq } from "drizzle-orm";
import { serve } from "@upstash/workflow/nextjs";

import { db } from "@/db";
import { videos } from "@/db/schema";

type InputType = {
  videoId: string;
  userId: string;
};

const TITLE_SYSTEM_PROMPT = `Your task is to generate an SEO-focused title for a YouTube video based on its transcript. Please follow these guidelines:
- Be concise but descriptive, using relevant keywords to improve discoverability.
- Highlight the most compelling or unique aspect of the video content.
- Avoid jargon or overly complex language unless it directly supports searchability.
- Use action-oriented phrasing or clear value propositions where applicable.
- Ensure the title is 3-8 words long and no more than 100 characters.
- ONLY return the title as plain text. Do not add quotes or any additional formatting.`;

export const { POST } = serve(async (context) => {
  const video = await context.run("get-video", async () => {
    const { userId, videoId } = context.requestPayload as InputType;

    const [existingVideo] = await db
      .select()
      .from(videos)
      .where(and(eq(videos.id, videoId), eq(videos.userId, userId)));

    if (!existingVideo) {
      throw new Error("Video not found");
    }

    return existingVideo;
  });

  const transcript = await context.run("get-transcript", async () => {
    const transcriptUrl = `https://stream.mux.com/${video.muxPlaybackId}/text/${video.muxTrackId}.txt`;

    const response = await fetch(transcriptUrl);
    const text = response.text();

    if (!text) {
      throw new Error("Bad request");
    }

    return text;
  });

  const { body } = await context.api.openai.call("Call Groq", {
    baseURL: "https://api.groq.com/openai",
    token: process.env.GROQ_API_KEY!,
    operation: "chat.completions.create",
    body: {
      model: "llama3-70b-8192",
      messages: [
        { role: "system", content: TITLE_SYSTEM_PROMPT },
        {
          role: "user",
          content: transcript,
        },
      ],
    },
  });

  await context.run("update-video-title", async () => {
    await db
      .update(videos)
      .set({
        title: body?.choices?.[0]?.message?.content || video.title,
      })
      .where(and(eq(videos.id, video.id), eq(videos.userId, video.userId!)));
  });
});
