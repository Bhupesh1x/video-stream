import { Heading } from "@/components/Heading";

import { LikedSection } from "../sections/LikedSection";

export function LikedView() {
  return (
    <div className="max-w-[1800px] mx-auto mb-10 px-4 py-2.5 flex flex-col gap-y-6">
      <Heading title="Liked" description="Videos you have liked" />
      <LikedSection />
    </div>
  );
}
