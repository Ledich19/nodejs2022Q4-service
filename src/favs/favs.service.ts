import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateFavDto } from './dto/create-fav.dto';
import { UpdateFavDto } from './dto/update-fav.dto';
import { albumDb, artistDb, favoriteDb, trackDb } from 'src/data/db';

@Injectable()
export class FavsService {
  create(key: string, id: string) {
    console.log('key-------------id', key, id);

    if (key === 'artists' && !artistDb.get(id)) {
      console.log('key-------------id work', key, id);
      throw new UnprocessableEntityException("Album with id doesn't exist.");
    }
    if (key === 'albums' && !albumDb.get(id)) {
      throw new UnprocessableEntityException("Album with id doesn't exist.");
    }
    if (key === 'tracks' && !trackDb.get(id)) {
      throw new UnprocessableEntityException("Track with id doesn't exist.");
    }
    //const key = 'artists';
    const valueInDb = favoriteDb.get(key);
    const value = valueInDb ? valueInDb.concat(id) : [id];
    return favoriteDb.insert(key, value);
  }

  findAll() {
    const artists =
      favoriteDb
        .get('artists')
        ?.map((id) => {
          return artistDb.get(id);
        })
        .filter(Boolean) || []; // Отфильтровываем пустые значения или возвращаем пустой массив

    const albums =
      favoriteDb
        .get('albums')
        ?.map((id) => {
          return albumDb.get(id);
        })
        .filter(Boolean) || []; // Отфильтровываем пустые значения или возвращаем пустой массив

    const tracks =
      favoriteDb
        .get('tracks')
        ?.map((id) => {
          return trackDb.get(id);
        })
        .filter(Boolean) || [];

    return {
      artists,
      albums,
      tracks,
    };
  }

  remove(key: string, id: string) {
    if (key === 'artists' && !artistDb.get(id)) {
      throw new NotFoundException('Album was not found.');
    }
    if (key === 'albums' && !albumDb.get(id)) {
      throw new NotFoundException('Album was not found.');
    }
    if (key === 'tracks' && !trackDb.get(id)) {
      throw new NotFoundException('Track was not found.');
    }
    const valueInDb = favoriteDb.get(key);
    const value = valueInDb.filter((idInArr) => idInArr !== id);
    return favoriteDb.insert(key, value);
  }
}
