import { VideoSection } from "../sections/VideoSection";
import { CommentSection } from "../sections/CommentSection";
import { SuggestionsSection } from "../sections/SuggestionsSection";

type Props = {
  videoId: string;
};

export function VideoIdView({ videoId }: Props) {
  return (
    <div className="pt-2.5 px-4 max-w-[1700px] mx-auto">
      <div className="flex gap-4">
        <div className="flex-1">
          <VideoSection videoId={videoId} />
          <div className="block lg:hidden">
            <SuggestionsSection />
          </div>
          <CommentSection videoId={videoId} />
        </div>
        <div className="hidden lg:block lg:w-[280px] xl:w-[360px] 2xl:w-[480px]">
          <SuggestionsSection />
        </div>
      </div>
    </div>
  );
}
