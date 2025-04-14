import { z } from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useClerk, useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";

import { trpc } from "@/trpc/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UserAvatar } from "@/components/UserAvatar";

type Props = {
  videoId: string;
  onSuccess?: () => void;
};

const formSchema = z.object({
  videoId: z.string().uuid(),
  value: z.string().trim().min(1, "Required"),
});

export function CommentForm({ videoId, onSuccess }: Props) {
  const { openSignIn } = useClerk();
  const { user, isSignedIn } = useUser();

  const utils = trpc.useUtils();

  const createComment = trpc.comments.create.useMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      videoId,
      value: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isSignedIn) {
      openSignIn();
      return null;
    }

    createComment.mutate(
      { ...values },
      {
        onSuccess: () => {
          toast.success("Comment added");
          form.reset();
          utils.comments.getMany.invalidate({ videoId });
          onSuccess?.();
        },
        onError: (error) => {
          toast.error("Failed to add comment");

          if (error?.data?.code === "UNAUTHORIZED") {
            openSignIn();
          }
        },
      }
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex gap-3">
          <UserAvatar
            size="lg"
            imageUrl={user?.imageUrl || "/images/user-placeholder.svg"}
            name={user?.firstName || "User"}
          />

          <FormField
            name="value"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Add a comment..."
                    className="resize-none min-h-0 overflow-hidden"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          className="ml-auto flex justify-end my-2"
          disabled={createComment.isPending}
        >
          Comment
        </Button>
      </form>
    </Form>
  );
}
