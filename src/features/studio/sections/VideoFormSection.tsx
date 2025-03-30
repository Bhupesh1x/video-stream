"use client";

import {
  CopyCheckIcon,
  CopyIcon,
  Globe2Icon,
  LockIcon,
  MoreVerticalIcon,
  Trash2Icon,
} from "lucide-react";
import { z } from "zod";
import Link from "next/link";
import { toast } from "sonner";
import { Suspense, useState } from "react";
import { trpc } from "@/trpc/client";
import { useForm } from "react-hook-form";
import { ErrorBoundary } from "react-error-boundary";
import { zodResolver } from "@hookform/resolvers/zod";

import { snakeCaseToTitle } from "@/lib/utils";
import { updateVideoSchema } from "@/db/schema";

import { VideoPlayer } from "@/features/videos/components/VideoPlayer";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Heading } from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { VideoFormCategoriesSelect } from "../components/videoForm/VideoFormCategoriesSelect";

type Props = {
  videoId: string;
};

function VideoFormSectionSuspence({ videoId }: Props) {
  const utils = trpc.useUtils();
  const [video] = trpc.studio.getOne.useSuspenseQuery({ id: videoId });

  const updateVideo = trpc.video.update.useMutation();

  const form = useForm<z.infer<typeof updateVideoSchema>>({
    resolver: zodResolver(updateVideoSchema),
    defaultValues: video,
  });

  function onSubmit(values: z.infer<typeof updateVideoSchema>) {
    updateVideo.mutate(values, {
      onSuccess: () => {
        toast.success("Video updated");

        utils.studio.getMany.invalidate();
        utils.studio.getOne.invalidate({ id: videoId });
        form.reset(values);
      },
      onError: () => {
        toast.error("Failed to update video");
      },
    });
  }

  const fullUrl = `${
    process.env.VERCEL_URL || "http://localhost:3000"
  }/videos/${video.id}`;

  const [isCopied, setIsCopied] = useState(false);

  function onCopy() {
    // eslint-disable-next-line prefer-const
    let timeout;
    navigator.clipboard.writeText(fullUrl);
    setIsCopied(true);

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex items-center justify-between">
          <Heading
            title="Video details"
            description="Manage your video details"
          />

          <div className="flex items-center gap-x-1">
            <Button type="submit" disabled={updateVideo.isPending}>
              {updateVideo.isPending ? "Saving..." : "Save"}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" type="button" size="icon">
                  <MoreVerticalIcon className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="cursor-pointer">
                  <Trash2Icon className="size-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 my-6">
          <div className="lg:col-span-3 space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Please enter your video title here"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value ?? ""}
                      placeholder="Add a description to your video"
                      rows={10}
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <VideoFormCategoriesSelect form={form} />
          </div>

          <div className="space-y-8 lg:col-span-2">
            <div className="flex flex-col gap-4 bg-[#F9f9f9] rounded-xl overflow-hidden h-fit">
              <div className="aspect-video overflow-hidden relative">
                <VideoPlayer
                  playbackId={video.muxPlaybackId ?? undefined}
                  thumbnailUrl={video.thumbnailUrl ?? undefined}
                />
              </div>
              <p className="text-xs text-muted-foreground px-4">
                Note: Since this project is using the unpaid version of Mux,
                videos will be automatically deleted after 24 hours
              </p>

              <div className="p-4 space-y-6">
                <div>
                  <p className="text-xs text-muted-foreground">Video link</p>
                  <div className="flex items-center gapx-x-1">
                    <Link href={`/videos/${video.id}`}>
                      <p className="text-blue-500 line-clamp-1 text-sm">
                        {fullUrl}
                      </p>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onCopy}
                      className="shrink-0"
                      disabled={isCopied}
                    >
                      {isCopied ? (
                        <CopyCheckIcon className="size-4" />
                      ) : (
                        <CopyIcon className="size-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Video status</p>
                  <p className="text-sm">
                    {snakeCaseToTitle(video.muxStatus ?? "preparing")}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Subtitles status
                  </p>
                  <p className="text-sm">
                    {snakeCaseToTitle(video.muxTrackStatus ?? "no_subtitles")}
                  </p>
                </div>
              </div>
            </div>

            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visibility</FormLabel>
                  <Select
                    defaultValue={field.value ?? undefined}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="public">
                        <div className="flex items-center gap-2">
                          <Globe2Icon className="size-4 mr-2" />
                          Public
                        </div>
                      </SelectItem>
                      <SelectItem value="private">
                        <div className="flex items-center gap-2">
                          <LockIcon className="size-4 mr-2" />
                          Private
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
  );
}

export function VideoFormSectionSkeleton() {
  return <p>Loading...</p>;
}

export function VideoFormSection({ videoId }: Props) {
  return (
    <Suspense fallback={<VideoFormSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <VideoFormSectionSuspence videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
}
