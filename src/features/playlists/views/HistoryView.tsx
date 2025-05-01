import { Heading } from "@/components/Heading";

import { HistorySection } from "../sections/HistorySection";

export function HistoryView() {
  return (
    <div className="max-w-[1800px] mx-auto mb-10 px-4 py-2.5 flex flex-col gap-y-6">
      <Heading title="History" description="Videos you have watched" />
      <HistorySection />
    </div>
  );
}
