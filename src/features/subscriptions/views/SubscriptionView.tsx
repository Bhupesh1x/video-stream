import { Heading } from "@/components/Heading";

import { SubscriptionSection } from "../sections/SubscriptionSection";

export function SubscriptionView() {
  return (
    <div className="max-w-screen-md mx-auto mb-10 px-4 py-2.5 flex flex-col gap-y-6">
      <Heading
        title="All subscriptions"
        description="View and manage all your subscriptions"
      />
      <SubscriptionSection />
    </div>
  );
}
