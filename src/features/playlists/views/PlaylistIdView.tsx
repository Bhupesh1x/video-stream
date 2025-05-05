import { PlaylistIdSection } from "../sections/PlaylistIdSection";
import { PlaylistIdHeaderSection } from "../sections/PlaylistIdHeaderSection";

type Props = {
  playlistId: string;
};

export function PlaylistIdView({ playlistId }: Props) {
  return (
    <div className="max-w-[1800px] mx-auto mb-10 px-4 py-2.5 flex flex-col gap-y-6">
      <PlaylistIdHeaderSection playlistId={playlistId} />
      <PlaylistIdSection playlistId={playlistId} />
    </div>
  );
}
