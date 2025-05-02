import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  SetMetadata,
  UseInterceptors,
} from '@nestjs/common';
import { GetUsersDocumentation } from './documentation/getUsers.decorator';
import { CreateManyUsersDto } from './dtos/create-many-users.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUsersParamDto } from './dtos/get-users-param.dto';
import { PatchUserDto } from './dtos/patch-user.dto';
import { CreateUserProvider } from './providers/create-user.provider';
import { UsersService } from './providers/users.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { NoAuth } from 'src/auth/decorators/no-auth.decorator';
import { plainToInstance } from 'class-transformer';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    /**
     * Inject createUserProvider
     */
    private readonly createUserProvider: CreateUserProvider,
  ) {}

  @Get()
  @GetUsersDocumentation()
  public getUsers(
    @Param() getUserParamDto: GetUsersParamDto,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return this.usersService.findAll(getUserParamDto, limit, page);
  }

  @Get('/:id')
  public getUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOneById(id);
  }

  // @SetMetadata('authType', 'none')
  @Post()
  @Auth(AuthType.None)
  // @UseInterceptors(ClassSerializerInterceptor)
  public async createUsers(@Body() createUserDto: CreateUserDto) {
    const user = await this.createUserProvider.createUser(createUserDto);
    return plainToInstance(User, user);
  }

  @Post('/create-many')
  @Auth(AuthType.None, AuthType.Bearer)
  public createManyUsers(@Body() createManyUsersDto: CreateManyUsersDto) {
    return this.usersService.createMany(createManyUsersDto);
  }

  @Patch()
  public patchUser(@Body() patchUserDto: PatchUserDto) {
    return patchUserDto;
  }
}
