import { UserAvatar } from "@/components/UserAvatar";

import { SubscribeButton } from "./SubscribeButton";

type Props = {
  name: string;
  imageUrl: string;
  subscriberCount: number;
  disabled: boolean;
  onUnsubscribe: () => void;
};

export function SubscriptionItem({
  name,
  imageUrl,
  subscriberCount,
  disabled,
  onUnsubscribe,
}: Props) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex-1 flex items-center gap-2">
        <UserAvatar imageUrl={imageUrl} name={name} />
        <div>
          <h4 className="text-sm font-semibold">{name}</h4>
          <p className="text-xs text-muted-foreground">
            {subscriberCount?.toLocaleString()} subscribers
          </p>
        </div>
      </div>

      <SubscribeButton
        isSubscribed
        disabled={disabled}
        onClick={(e) => {
          e.preventDefault();
          onUnsubscribe();
        }}
      />
    </div>
  );
}
