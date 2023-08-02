import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { log } from 'console';

try {
} catch (error) {
  throw new InternalServerErrorException('Error deleting user:', error.message);
}

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.prisma.user.create({
        data: {
          ...createUserDto,
        },
      });
      return {
        ...user,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error create user:',
        error.message,
      );
    }
  }

  async findAll() {
    try {
      const users = await this.prisma.user.findMany();
      return users;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching users');
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id,
        },
      });
      if (!user) throw new NotFoundException();
      return user;
    } catch (error) {
      if (error instanceof NotFoundException)
        throw new NotFoundException('User not found');
      throw new InternalServerErrorException('Error deleting user:');
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id,
        },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      if (user.password !== updateUserDto.oldPassword) {
        throw new ForbiddenException('oldPassword is wrong');
      }
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: {
          password: updateUserDto.newPassword,
          version: {
            increment: 1,
          },
        },
      });
      return updatedUser;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      if (error instanceof ForbiddenException) throw error;
      throw new InternalServerErrorException('Error deleting user:');
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.user.delete({
        where: {
          id,
        },
      });
      return { message: 'User deleted successfully' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('User not found');
      } else {
        throw new InternalServerErrorException('Error deleting user:');
      }
    }
  }
}
