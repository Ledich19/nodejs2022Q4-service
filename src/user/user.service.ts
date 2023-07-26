import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
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
    console.log(userDb.showAll());
    return userDb.showAll();
  }

  findOne(id: string) {
    const user = userDb.get(id);
    if (!user) {
      new NotFoundException('User not found');
    }
    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const user = userDb.get(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (user.password !== updateUserDto.oldPassword) {
      throw new HttpException('User not found', HttpStatus.FORBIDDEN);
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
