import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseUUIDPipe,
  HttpStatus,
  HttpCode,
  UseInterceptors,
} from '@nestjs/common';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ExcludePasswordInterceptor } from './user.interceptor';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  @UseInterceptors(ExcludePasswordInterceptor)
  create(@Body() createUserDto: CreateUserDto) {
    const user = this.userService.create(createUserDto);
    return user;
  }

  @Get()
  @UseInterceptors(ExcludePasswordInterceptor)
  findAll() {
    const users = this.userService.findAll();
    return users;
  }

  @Get(':id')
  @UseInterceptors(ExcludePasswordInterceptor)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    const user = this.userService.findOne(id);
    return user;
  }

  @Put(':id')
  @UseInterceptors(ExcludePasswordInterceptor)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const userUpdated = this.userService.update(id, updateUserDto);
    return userUpdated;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    this.userService.remove(id);
    return;
  }
}
