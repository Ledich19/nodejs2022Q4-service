export class Fav {
  artists: ArtistDto[];
  albums: AlbumDto[];
  tracks: TrackDto[];
}

export class ArtistDto {
  id: string;
  name: string;
  grammy: boolean;
}

export class AlbumDto {
  id: string;
  name: string;
  year: number;
  artistId: string;
}

export class TrackDto {
  id: string;
  name: string;
  artistId: string;
  albumId: string;
  duration: number;
}
