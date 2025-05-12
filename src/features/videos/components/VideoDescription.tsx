import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

type Props = {
  description: string;
  compactViews: string;
  compactDate: string;
  expandedViews: string;
  expandedDate: string;
};

export function VideoDescription({
  description,
  compactDate,
  compactViews,
  expandedDate,
  expandedViews,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  function onExpand() {
    setIsExpanded(true);
  }

  function onShrink(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.stopPropagation();
    setIsExpanded(false);
  }

  return (
    <div
      className="bg-gray-100 rounded-xl p-2 space-y-3 cursor-pointer hover:bg-gray-200 transition"
      onClick={onExpand}
    >
      <p className="text-sm font-medium">
        {isExpanded ? expandedViews : compactViews} views &nbsp;&nbsp;
        {isExpanded ? expandedDate : compactDate}
      </p>

      <p
        className={`text-sm whitespace-pre-wrap ${
          !isExpanded ? "line-clamp-2" : ""
        }`}
      >
        {description || "No description"}
      </p>

      {isExpanded ? (
        <div
          className="flex items-center gap-1 cursor-pointer text-sm font-medium select-none"
          onClick={(e) => onShrink(e)}
        >
          Show less
          <ChevronUpIcon className="size-4" />
        </div>
      ) : (
        <div className="flex items-center gap-1 cursor-pointer text-sm font-medium select-none">
          Show more
          <ChevronDownIcon className="size-4" />
        </div>
      )}
    </div>
  );
}
