import { usersRoutes } from 'test/endpoints';
import { v4 as uuidv4 } from 'uuid';
import { InMemoryDatabase } from './dbClass';
import { Album, Artist, Favorites, Track, User } from './dbTypes';

export const userDb = new InMemoryDatabase<User>();
export const artistDb = new InMemoryDatabase<Artist>();
export const trackDb = new InMemoryDatabase<Track>();
export const albumDb = new InMemoryDatabase<Album>();
export const favoriteDb = new InMemoryDatabase<string[]>();
