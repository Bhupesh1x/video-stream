import { PlaylistsType } from "../../types";

type Props = {
  playlist: PlaylistsType["items"][number];
};

export function PlaylistInfo({ playlist }: Props) {
  return (
    <div>
      <h1 className="font-semibold text-sm line-clamp-2 break-words">
        {playlist?.name || ""}
      </h1>
      <p className="text-sm text-muted-foreground">Playlist</p>
      <p className="text-sm text-muted-foreground font-semibold hover:text-primary">
        View full playlist
      </p>
    </div>
  );
}
