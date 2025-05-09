import { UserSection } from "../sections/UserSection";

type Props = {
  userId: string;
};

export function UserView({ userId }: Props) {
  return (
    <div className="max-w-[1800px] mx-auto mb-10 px-4 py-2.5 flex flex-col gap-y-6">
      <UserSection userId={userId} />
    </div>
  );
}
