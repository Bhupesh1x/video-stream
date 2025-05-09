"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { trpc } from "@/trpc/client";

import { UserSectionInfo } from "../components/UserSectionInfo";
import { UserSectionBanner } from "../components/UserSectionBanner";

type Props = {
  userId: string;
};

function UserSectionSuspense({ userId }: Props) {
  const [user] = trpc.user.getOne.useSuspenseQuery({ id: userId });

  return (
    <div className="space-y-3">
      <UserSectionBanner user={user} />
      <UserSectionInfo user={user} />
    </div>
  );
}

function UserSectionSkeleton() {
  return <p>Loading...</p>;
}

export function UserSection(props: Props) {
  return (
    <Suspense fallback={<UserSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <UserSectionSuspense {...props} />
      </ErrorBoundary>
    </Suspense>
  );
}
