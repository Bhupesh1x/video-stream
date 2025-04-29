import { Heading } from "@/components/Heading";

import { SubscriptionsVideosSection } from "../sections/SubscriptionsVideosSection";

export function SubscriptionsView() {
  return (
    <div className="max-w-[2400px] mx-auto mb-10 px-4 py-2.5 flex flex-col gap-y-6">
      <Heading
        title="Subscriptions"
        description="Videos from your favorite creators"
      />
      <SubscriptionsVideosSection />
    </div>
  );
}
