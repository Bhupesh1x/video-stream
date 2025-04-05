"use client";

import {
  CopyCheckIcon,
  CopyIcon,
  Globe2Icon,
  ImagePlusIcon,
  Loader2,
  LockIcon,
  MoreVerticalIcon,
  RotateCcwIcon,
  SparklesIcon,
  Trash2Icon,
} from "lucide-react";
import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { trpc } from "@/trpc/client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";
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

import { ThumbnailUploadModal } from "../components/ThumbnailUploadModal";
import { VideoFormCategoriesSelect } from "../components/videoForm/VideoFormCategoriesSelect";

type Props = {
  videoId: string;
};

function VideoFormSectionSuspence({ videoId }: Props) {
  const router = useRouter();

  const [isThumbnailModalOpen, setIsThumbnailModalOpen] = useState(false);

  const utils = trpc.useUtils();
  const [video] = trpc.studio.getOne.useSuspenseQuery({ id: videoId });

  const updateVideo = trpc.video.update.useMutation();
  const deleteVideo = trpc.video.remove.useMutation();
  const restoreThumbnail = trpc.video.restore.useMutation();
  const generateTitle = trpc.video.generateTitle.useMutation();
  const generateDescription = trpc.video.generateDescription.useMutation();

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

  function onDelete(id: string) {
    deleteVideo.mutate(
      { id },
      {
        onSuccess: () => {
          toast.success("Video deleted");

          utils.studio.getMany.invalidate();
          router.replace("/studio");
        },
        onError: () => {
          toast.error("Failed to delete video");
        },
      }
    );
  }

  function onRestoreThumbnail(id: string) {
    restoreThumbnail.mutate(
      { id },
      {
        onSuccess: () => {
          toast.success("Thumbnail restored");

          utils.studio.getMany.invalidate();
          utils.studio.getOne.invalidate({ id });
        },
        onError: () => {
          toast.error("Failed to restore thumbnail");
        },
      }
    );
  }

  function onGenerateTitle(id: string) {
    generateTitle.mutate(
      { id },
      {
        onSuccess: () => {
          toast.success("Background job started", {
            description: "This may take some time",
            classNames: {
              description: "toast-description",
            },
          });
        },
        onError: () => {
          toast.error("Failed to generate title");
        },
      }
    );
  }

  function onGenerateDescription(id: string) {
    generateDescription.mutate(
      { id },
      {
        onSuccess: () => {
          toast.success("Background job started", {
            description: "This may take some time",
            classNames: {
              description: "toast-description",
            },
          });
        },
        onError: () => {
          toast.error("Failed to generate description");
        },
      }
    );
  }

  return (
    <>
      <ThumbnailUploadModal
        open={isThumbnailModalOpen}
        onOpenChange={setIsThumbnailModalOpen}
        videoId={video.id}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex items-center justify-between">
            <Heading
              title="Video details"
              description="Manage your video details"
            />

            <div className="flex items-center gap-x-1">
              <Button
                type="submit"
                disabled={deleteVideo.isPending || updateVideo.isPending}
              >
                {updateVideo.isPending ? "Saving..." : "Save"}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" type="button" size="icon">
                    <MoreVerticalIcon className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => onDelete(video.id)}
                    disabled={deleteVideo.isPending || updateVideo.isPending}
                  >
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
                    <FormLabel>
                      <div className="flex items-center gap-x-2">
                        Title
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full size-6 [&_svg]:size-3"
                          type="button"
                          onClick={() => onGenerateTitle(video.id)}
                          disabled={
                            generateTitle.isPending || !video.muxTrackId
                          }
                        >
                          {generateTitle.isPending ? (
                            <Loader2 className="animate-spin" />
                          ) : (
                            <SparklesIcon />
                          )}
                        </Button>
                      </div>
                    </FormLabel>
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
                    <FormLabel>
                      <div className="flex items-center gap-x-2">
                        Description
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full size-6 [&_svg]:size-3"
                          type="button"
                          onClick={() => onGenerateDescription(video.id)}
                          disabled={
                            generateDescription.isPending || !video.muxTrackId
                          }
                        >
                          {generateDescription.isPending ? (
                            <Loader2 className="animate-spin" />
                          ) : (
                            <SparklesIcon />
                          )}
                        </Button>
                      </div>
                    </FormLabel>
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
              <FormField
                name="thumbnailUrl"
                control={form.control}
                render={() => (
                  <FormItem>
                    <FormLabel>Thumbnail</FormLabel>
                    <div className="p-0.5 relative h-[84px] w-[153px] group">
                      <Image
                        fill
                        src={video.thumbnailUrl || "/images/placeholder.svg"}
                        alt="thumbnail-img"
                        className="object-cover bg-gray-100 rounded-xl"
                      />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="icon"
                            className="bg-black/50 hover:bg-black/50 cursor-pointer opacity-100 md:opacity-0 hover:opacity-100 absolute top-1 right-1"
                          >
                            <MoreVerticalIcon className="text-white" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" side="right">
                          <DropdownMenuItem
                            className="cursor-pointer hover:bg-gray-100 transition"
                            onClick={() => setIsThumbnailModalOpen(true)}
                          >
                            <ImagePlusIcon className="size-4 mr-1" />
                            Change
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 transition">
                            <SparklesIcon className="size-4 mr-1" />
                            AI-generated
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer hover:bg-gray-100 transition"
                            onClick={() => onRestoreThumbnail(video.id)}
                          >
                            <RotateCcwIcon className="size-4 mr-1" />
                            Restore
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
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
                        disabled={
                          deleteVideo.isPending ||
                          updateVideo.isPending ||
                          isCopied
                        }
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
                    <p className="text-xs text-muted-foreground">
                      Video status
                    </p>
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
    </>
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
