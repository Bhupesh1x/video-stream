import { toast } from "sonner";
import { useClerk } from "@clerk/nextjs";

import { trpc } from "@/trpc/client";

type Props = {
  creatorId: string;
  fromVideoId?: string;
  isSubscribed: boolean;
};

export function useSubscriptions({
  creatorId,
  isSubscribed,
  fromVideoId,
}: Props) {
  const utils = trpc.useUtils();
  const { isSignedIn, openSignIn } = useClerk();

  const subscribe = trpc.subscriptions.create.useMutation();
  const unsubscribe = trpc.subscriptions.remove.useMutation();

  const isPending = subscribe.isPending || unsubscribe.isPending;

  function onClick() {
    if (!isSignedIn) {
      return openSignIn();
    }

    if (isSubscribed) {
      unsubscribe.mutate(
        { userId: creatorId },
        {
          onSuccess: () => {
            toast.success("Unsubscribed");

            utils.video.getManySubscriptions.invalidate();
            utils.user.getOne.invalidate({ id: creatorId });

            if (fromVideoId) {
              utils.video.getOne.invalidate({ videoId: fromVideoId });
            }
          },
          onError: (error) => {
            if (error?.data?.code === "UNAUTHORIZED") {
              openSignIn();
            }
          },
        }
      );
    } else {
      subscribe.mutate(
        { userId: creatorId },
        {
          onSuccess: () => {
            toast.success("Subscribed");

            utils.video.getManySubscriptions.invalidate();
            utils.user.getOne.invalidate({ id: creatorId });

            if (fromVideoId) {
              utils.video.getOne.invalidate({ videoId: fromVideoId });
            }
          },
          onError: (error) => {
            if (error?.data?.code === "UNAUTHORIZED") {
              openSignIn();
            }
          },
        }
      );
    }
  }

  return {
    isPending,
    onClick,
  };
}
