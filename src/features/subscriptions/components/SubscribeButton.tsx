import { Button, ButtonProps } from "@/components/ui/button";

type Props = {
  isSubscribed: boolean;
  disabled: boolean;
  onClick: ButtonProps["onClick"];
  className?: string;
  size?: ButtonProps["size"];
};

export function SubscribeButton({
  disabled,
  size,
  isSubscribed,
  className,
  onClick,
}: Props) {
  return (
    <Button
      size={size}
      className={`rounded-full ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {isSubscribed ? "Unsubscribe" : "Subscribe"}
    </Button>
  );
}
