import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { v4 as uuidv4 } from 'uuid';
import { albumDb } from 'src/data/db';

@Injectable()
export class AlbumService {
  create(createAlbumDto: CreateAlbumDto) {
    const id = uuidv4();
    console.log('CreateArtistDto-2', createAlbumDto);
    return albumDb.insert(id, {
      ...createAlbumDto,
      id,
    });
  }

  findAll() {
    return albumDb.showAll();
  }

  findOne(id: string) {
    const album = albumDb.get(id);
    if (!album) {
      throw new NotFoundException('Album was not found.');
    }
    return album;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const album = albumDb.get(id);
    if (!album) {
      throw new NotFoundException('Album was not found.');
    }
    return albumDb.insert(id, { ...album, ...updateAlbumDto });
  }

  remove(id: string) {
    const album = albumDb.get(id);
    if (!album) {
      throw new NotFoundException('Album was not found.');
    }
    return albumDb.delete(id);
  }
}
