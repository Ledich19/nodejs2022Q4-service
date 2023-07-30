export interface Artist {
  id: string;
  name: string;
  grammy: boolean;
}
export interface Track {
  id: string;
  name: string;
  artistId: string | null;
  duration: number;
}
export interface Album {
  id: string;
  name: string;
  year: number;
  artistId: string | null;
}
export interface Favorites {
  artists: string[];
  albums: string[];
  tracks: string[];
}
