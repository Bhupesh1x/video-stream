import { Heading } from "@/components/Heading";

import { TrendingVideosSection } from "../sections/TrendingVideosSection";

export function TrendingView() {
  return (
    <div className="max-w-[2400px] mx-auto mb-10 px-4 py-2.5 flex flex-col gap-y-6">
      <Heading
        title="Trending"
        description="Most popular videos at the moment"
      />
      <TrendingVideosSection />
    </div>
  );
}
