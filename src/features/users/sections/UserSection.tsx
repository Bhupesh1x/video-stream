"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { trpc } from "@/trpc/client";

import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

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
      <Separator />
    </div>
  );
}

function UserSectionSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-[15vh] md:h-[25vh] max-h-[200px]w-full rounded-xl" />

      <div className="w-full">
        <div className="flex items-center gap-3 w-full">
          <div className="block md:hidden">
            <Skeleton className="rounded-full h-16 w-16" />
          </div>
          <div className="hidden md:block">
            <Skeleton className="rounded-full h-[160px] w-[160px]" />
          </div>

          <div className="space-y-[2px] flex-1 w-full">
            <Skeleton className="w-[180px] h-[28px] md:h-[40px]" />
            <Skeleton className="h-[20px] w-[240px] md:mt-1" />
            <div className="hidden md:block">
              <Skeleton className="h-[36px] w-[200px] rounded-full mt-2" />
            </div>
          </div>
        </div>
        <div className="block md:hidden">
          <Skeleton className="h-[36px] w-full rounded-full mt-3" />
        </div>
      </div>
      <Separator />
    </div>
  );
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
