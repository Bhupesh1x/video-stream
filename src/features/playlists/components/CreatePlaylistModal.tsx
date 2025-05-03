"use client";

import { z } from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { trpc } from "@/trpc/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ResponsiveModal } from "@/components/ResponsiveModal";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const formSchema = z.object({
  name: z.string().trim().min(1),
});

export function CreatePlaylistModal({ open, onOpenChange }: Props) {
  const create = trpc.playlists.create.useMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const utils = trpc.useUtils();
  function onSubmit(values: z.infer<typeof formSchema>) {
    create.mutate(values, {
      onSuccess: () => {
        toast.success("Playlist created");
        utils.playlists.getMany.invalidate();
        form.reset();
        onOpenChange(false);
      },
      onError: () => {
        toast.error("Failed to create playlist");
      },
    });
  }

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title="Create a playlist"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Playlist name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="My favorite videos..."
                    disabled={false}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="w-full flex justify-end">
            <Button disabled={false}>Create</Button>
          </div>
        </form>
      </Form>
    </ResponsiveModal>
  );
}
