import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ArtistService {
  constructor(private prisma: PrismaService) {}
  async create(createArtistDto: CreateArtistDto) {
    const artist = await this.prisma.artist.create({
      data: {
        ...createArtistDto,
      },
    });
    return {
      ...artist,
    };
  }

  async findAll() {
    const artists = await this.prisma.artist.findMany();
    return artists;
  }

  async findOne(id: string) {
    const artist = await this.prisma.artist.findUnique({
      where: {
        id,
      },
    });
    if (!artist) throw new NotFoundException('Artist not found');
    return artist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    try {
      const updatedArtist = await this.prisma.artist.update({
        where: { id },
        data: { ...updateArtistDto },
      });
      return updatedArtist;
    } catch (error) {
      if (error.code === 'P2025')
        throw new NotFoundException('Artist not found');
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.artist.delete({
        where: {
          id,
        },
      });

      return { message: 'Artist deleted successfully' };
    } catch (error) {
      console.log(error);
      if (error.code === 'P2025')
        throw new NotFoundException('Artist not found');
    }
  }
}
