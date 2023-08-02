import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { v4 as uuidv4 } from 'uuid';
import { albumDb, trackDb } from 'src/data/db';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AlbumService {
  constructor(private prisma: PrismaService) {}

  async create(createAlbumDto: CreateAlbumDto) {
    const album = await this.prisma.album.create({
      data: {
        ...createAlbumDto,
      },
    });
    return album;
  }

  async findAll() {
    return await this.prisma.album.findMany();
  }

  async findOne(id: string) {
    const album = await this.prisma.album.findUnique({
      where: {
        id,
      },
    });
    if (!album) throw new NotFoundException('Album was not found.');
    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    try {
      const updatedAlbum = await this.prisma.album.update({
        where: { id },
        data: { ...updateAlbumDto },
      });
      return updatedAlbum;
    } catch (error) {
      if (error.code === 'P2025')
        throw new NotFoundException('Album was not found.');
    }

    // const album = albumDb.get(id);
    // if (!album) {
    //   throw new NotFoundException('Album was not found.');
    // }
    // return albumDb.insert(id, { ...album, ...updateAlbumDto });
  }

  async remove(id: string) {
    try {
      await this.prisma.album.delete({
        where: {
          id,
        },
      });

      await this.prisma.track.updateMany({
        where: {
          artistId: id,
        },
        data: { artistId: null },
      });

      return { message: 'Album deleted successfully' };
    } catch (error) {
      console.log(error);
      if (error.code === 'P2025')
        throw new NotFoundException('Album was not found');
    }

    // const album = albumDb.get(id);
    // if (!album) {
    //   throw new NotFoundException('Album was not found.');
    // }
    // trackDb.showAll().forEach((track) => {
    //   if (track.albumId === id) {
    //     trackDb.insert(track.id, { ...track, albumId: null });
    //   }
    // });
    // return albumDb.delete(id);
  }
}
