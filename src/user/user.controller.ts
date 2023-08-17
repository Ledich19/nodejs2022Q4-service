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
  ClassSerializerInterceptor,
  UseGuards,
} from '@nestjs/common';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ExcludePasswordInterceptor } from './user.interceptor';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  @UseInterceptors(ExcludePasswordInterceptor, ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Create user', description: 'Creates a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been created.',
    type: CreateUserDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. body does not contain required fields',
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = await this.userService.create(createUserDto);
    return new UserEntity(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  @UseInterceptors(ExcludePasswordInterceptor, ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Get all users', description: 'Gets all users' })
  @ApiResponse({
    status: 200,
    description: 'Successful operation',
    content: {
      'application/json': {
        schema: { type: 'array', items: { $ref: '#/components/schemas/User' } },
      },
    },
  })
  async findAll(): Promise<UserEntity[]> {
    const users = await this.userService.findAll();
    return users.map((user) => new UserEntity(user));
  }

  @Get(':id')
  @UseInterceptors(ExcludePasswordInterceptor, ClassSerializerInterceptor)
  @ApiOperation({
    summary: 'Get single user by id',
    description: 'Get single user by id',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful operation',
    type: UserEntity,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. userId is invalid (not uuid)',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<UserEntity> {
    const user = await this.userService.findOne(id);
    return new UserEntity(user);
  }

  @Put(':id')
  @UseInterceptors(ExcludePasswordInterceptor, ClassSerializerInterceptor)
  @ApiOperation({
    summary: "Update a user's password",
    description: "Updates a user's password by ID",
  })
  @ApiParam({ name: 'id', type: 'string', description: 'User ID (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'The user has been updated.',
    type: UserEntity,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. userId is invalid (not uuid)',
  })
  @ApiResponse({ status: 403, description: 'oldPassword is wrong' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const userUpdated = await this.userService.update(id, updateUserDto);
    return new UserEntity(userUpdated);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user', description: 'Deletes user by ID.' })
  @ApiParam({ name: 'id', type: 'string', description: 'User ID (UUID)' })
  @ApiResponse({ status: 204, description: 'The user has been deleted' })
  @ApiResponse({
    status: 400,
    description: 'Bad request. userId is invalid (not uuid)',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.userService.remove(id);
    return;
  }
}
