import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavsService {
  constructor(private prisma: PrismaService) {}

  async create(key: 'artists' | 'albums' | 'tracks', id: string) {
    try {
      if (key === 'artists') {
        const artist = await this.prisma.favoritesArtists.create({
          data: { artistId: id },
        });
        return artist;
      }
      if (key === 'albums') {
        const album = await this.prisma.favoritesAlbums.create({
          data: { albumId: id },
        });

        return album;
      }
      if (key === 'tracks') {
        const track = await this.prisma.favoritesTracks.create({
          data: { trackId: id },
        });
        return track;
      }
    } catch (error) {
      if (key === 'artists' && error.code === 'P2003') {
        throw new UnprocessableEntityException("Album with id doesn't exist.");
      }
      if (key === 'albums' && error.code === 'P2003') {
        throw new UnprocessableEntityException("Album with id doesn't exist.");
      }
      if (key === 'tracks' && error.code === 'P2003') {
        throw new UnprocessableEntityException("Track with id doesn't exist.");
      }
    }
  }

  async findAll() {
    const artists = await this.prisma.favoritesArtists.findMany({
      include: {
        artist: true,
      },
    });
    const albums = await this.prisma.favoritesAlbums.findMany({
      include: {
        album: true,
      },
    });
    const tracks = await this.prisma.favoritesTracks.findMany({
      include: {
        track: true,
      },
    });

    return {
      artists: artists.map((artist) => artist.artist),
      albums: albums.map((album) => album.album),
      tracks: tracks.map((track) => track.track),
    };
  }

  async remove(key: string, id: string) {
    console.log('');

    if (key === 'artists') {
      try {
        await this.prisma.favoritesArtists.delete({
          where: {
            artistId: id,
          },
        });
        return;
      } catch (error) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Artist is not favorite.');
        }
      }
    }

    if (key === 'albums') {
      try {
        await this.prisma.favoritesAlbums.delete({
          where: {
            albumId: id,
          },
        });
        return;
      } catch (error) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Album is not favorite.');
        }
      }
    }

    if (key === 'tracks') {
      try {
        await this.prisma.favoritesTracks.delete({
          where: {
            trackId: id,
          },
        });
        return;
      } catch (error) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Track is not favorite.');
        }
      }
    }
  }
}
