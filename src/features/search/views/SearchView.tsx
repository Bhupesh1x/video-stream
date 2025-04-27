import { CategoriesSection } from "@/features/home/sections/CategoriesSection";

import { ResultsSection } from "../sections/ResultsSection";

type Props = {
  searchParams: {
    query: string | undefined;
    categoryId: string | undefined;
  };
};

export function SearchView({ searchParams }: Props) {
  return (
    <div className="max-w-[1700px] mx-auto mb-10 px-4 py-2.5 space-y-6">
      <CategoriesSection categoryId={searchParams?.categoryId} />
      <ResultsSection
        query={searchParams.query}
        categoryId={searchParams.categoryId}
      />
    </div>
  );
}
