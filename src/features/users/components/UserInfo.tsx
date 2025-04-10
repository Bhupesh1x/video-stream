import { cva, VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const userInfoVarints = cva("flex items-ceter gap-1", {
  variants: {
    size: {
      default: "[&_p]:text-sm [&_svg]:size-4",
      lg: "[&_p]:text-base [&_p]:font-medium [&_p]:text-black [&_svg]:size-5",
      sm: "[&_p]:text-sm [&_svg]:size-4",
    },
    defaultvariants: {
      size: "default",
    },
  },
});

interface Props extends VariantProps<typeof userInfoVarints> {
  name: string;
  className?: string;
}

export function UserInfo({ name, className, size }: Props) {
  return (
    <div className={cn(userInfoVarints({ size, className }))}>
      <Tooltip>
        <TooltipTrigger asChild>
          <p className="text-gray-500 hover:text-gray-800 line-clamp-1 transition">
            {name}
          </p>
        </TooltipTrigger>
        <TooltipContent align="center" className="bg-black/70">
          {name}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
