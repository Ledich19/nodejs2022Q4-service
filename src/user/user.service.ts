import { compare, hash } from 'bcrypt';
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  salt = this.configService.get('auth.salt');
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const passwordHash = await hash(createUserDto.password, this.salt);
    const user = await this.prisma.user.create({
      data: {
        login: createUserDto.login,
        passwordHash,
      },
    });
    return {
      ...user,
    };
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) throw new NotFoundException('User not found');

    const isCompare = await compare(
      updateUserDto.oldPassword,
      user.passwordHash,
    );
    if (!isCompare) throw new ForbiddenException('oldPassword is wrong');

    const newPasswordHash = await hash(updateUserDto.newPassword, this.salt);
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        passwordHash: newPasswordHash,
        version: {
          increment: 1,
        },
      },
    });
    return updatedUser;
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
      if (error.code === 'P2025') throw new NotFoundException('User not found');
    }
  }
}
