"use client";

import { z } from "zod";
import { toast } from "sonner";
import { Suspense } from "react";
import { trpc } from "@/trpc/client";
import { useForm } from "react-hook-form";
import { ErrorBoundary } from "react-error-boundary";
import { zodResolver } from "@hookform/resolvers/zod";
import { MoreVerticalIcon, Trash2Icon } from "lucide-react";

import { updateVideoSchema } from "@/db/schema";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
    if (Object.keys(form.formState.touchedFields)?.length <= 0) return;

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
