import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { albumDb, artistDb, trackDb } from 'src/data/db';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ArtistService {
  create(CreateArtistDto: CreateArtistDto) {
    const id = uuidv4();
    return artistDb.insert(id, {
      ...CreateArtistDto,
      id,
    });
  }

  findAll() {
    return artistDb.showAll();
  }

  findOne(id: string) {
    const user = artistDb.get(id);
    if (!user) {
      new NotFoundException('Artist not found');
    }
    return user;
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    const artist = artistDb.get(id);
    if (!artist) {
      throw new NotFoundException('	Artist was not found.');
    }

    return artistDb.insert(id, { ...artist, ...updateArtistDto });
  }

  remove(id: string) {
    const deletedArtist = artistDb.get(id);
    if (!deletedArtist) {
      throw new NotFoundException('	Artist was not found.');
    }

    albumDb.showAll().forEach((album) => {
      if (album.artistId === id) {
        albumDb.insert(album.id, { ...album, artistId: null });
      }
    });

    trackDb.showAll().forEach((track) => {
      if (track.artistId === id) {
        trackDb.insert(track.id, { ...track, artistId: null });
      }
    });

    return artistDb.delete(id);
  }
}
