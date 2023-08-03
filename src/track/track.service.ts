import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TrackService {
  constructor(private prisma: PrismaService) {}

  async create(createTrackDto: CreateTrackDto) {
    const track = await this.prisma.track.create({
      data: {
        ...createTrackDto,
      },
    });
    return track;
  }

  async findAll() {
    return await this.prisma.track.findMany();
  }

  async findOne(id: string) {
    const track = await this.prisma.track.findUnique({
      where: {
        id,
      },
    });
    if (!track) throw new NotFoundException('Track was not found.');
    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    try {
      const updatedTrack = await this.prisma.track.update({
        where: { id },
        data: { ...updateTrackDto },
      });
      return updatedTrack;
    } catch (error) {
      if (error.code === 'P2025')
        throw new NotFoundException('Track was not found.');
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.track.delete({
        where: {
          id,
        },
      });

      return { message: 'Treck deleted successfully' };
    } catch (error) {
      if (error.code === 'P2025')
        throw new NotFoundException('Track was not found.');
    }
  }
}
