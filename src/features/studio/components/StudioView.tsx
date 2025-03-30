import { Heading } from "@/components/Heading";
import { VideosSection } from "../sections/VideosSections";

export function StudioView() {
  return (
    <div className="flex flex-col gap-y-6 pt-2.5">
      <div className="px-4">
        <Heading
          title="Channel content"
          description="Manage your channel content and videos"
        />
      </div>
      <VideosSection />
    </div>
  );
}
