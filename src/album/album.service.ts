import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
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
  }

  async remove(id: string) {
    try {
      await this.prisma.album.delete({
        where: {
          id,
        },
      });

      return { message: 'Album deleted successfully' };
    } catch (error) {
      if (error.code === 'P2025')
        throw new NotFoundException('Album was not found');
    }
  }
}
