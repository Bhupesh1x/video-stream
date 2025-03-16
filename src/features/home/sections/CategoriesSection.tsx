"use client";

import { useRouter } from "next/navigation";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense, useCallback, useMemo } from "react";

import { trpc } from "@/trpc/client";

import { FilterCarousel } from "@/components/FilterCarousel";

type Props = {
  categoryId?: string;
};

function CategoriesSectionSuspence({ categoryId }: Props) {
  const [categories] = trpc.categories.getMany.useSuspenseQuery();

  const router = useRouter();

  const data = useMemo(() => {
    return categories?.map((category) => ({
      value: category.id,
      label: category.name,
    }));
  }, [categories]);

  const onSelect = useCallback(
    (value: string | null) => {
      const url = new URL(window.location.href);

      if (value) {
        url.searchParams.set("categoryId", value);
      } else {
        url.searchParams.delete("categoryId");
      }

      router.push(url.toString());
    },
    [router]
  );

  return <FilterCarousel data={data} value={categoryId} onSelect={onSelect} />;
}

function CategoriesSkeleton() {
  return <FilterCarousel data={[]} isLoading onSelect={() => {}} />;
}

export function CategoriesSection({ categoryId }: Props) {
  return (
    <Suspense fallback={<CategoriesSkeleton />}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <CategoriesSectionSuspence categoryId={categoryId} />
      </ErrorBoundary>
    </Suspense>
  );
}
