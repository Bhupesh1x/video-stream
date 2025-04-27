import { CategoriesSection } from "../sections/CategoriesSection";

type Props = {
  categoryId?: string;
};

export function HomeView({ categoryId }: Props) {
  return (
    <div className="max-w-[2400px] mx-auto mb-10 px-4 py-2.5 flex flex-col gap-y-6">
      <CategoriesSection categoryId={categoryId} />
    </div>
  );
}
