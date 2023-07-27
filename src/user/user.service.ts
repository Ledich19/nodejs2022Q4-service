import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { userDb } from 'src/data/db';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  create(createUserDto: CreateUserDto) {
    const id = uuidv4();
    const version = 1;
    const createdAt = Date.now();
    const updatedAt = createdAt;
    return userDb.insert(id, {
      ...createUserDto,
      id,
      version,
      createdAt,
      updatedAt,
    });
  }

  findAll() {
    return userDb.showAll();
  }

  findOne(id: string) {
    const user = userDb.get(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const user = userDb.get(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.password !== updateUserDto.oldPassword) {
      throw new ForbiddenException('oldPassword is wrong');
    }
    return userDb.insert(id, {
      ...user,
      password: updateUserDto.newPassword,
      version: user.version + 1,
      updatedAt: Date.now(),
    });
  }

  remove(id: string) {
    const deletedUser = userDb.get(id);
    if (!deletedUser) {
      throw new NotFoundException('User not found');
    }
    return userDb.delete(id);
  }
}
