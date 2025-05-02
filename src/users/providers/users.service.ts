import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/providers/auth.service';
import { Repository } from 'typeorm';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';
import { GetUsersParamDto } from '../dtos/get-users-param.dto';
import { GoogleUser } from '../interfaces/google-user.interface';
import { User } from '../user.entity';
import { UserCreateManyProvider } from './user-create-many.provider';
import { CreateUserDto } from '../dtos/create-user.dto';
import { CreateUserProvider } from './create-user.provider';

/**
 * Class to connect to Users table and perform business operations
 */
@Injectable()
export class UsersService {
  /**
   * The constructor which injects authservice
   */
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    /**
     * Inject usersCreateManyProvider
     */
    private readonly usersCreateManyProvider: UserCreateManyProvider,

    /**
     * Inject createUserProvider
     */
    private readonly createUserProvider: CreateUserProvider,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    return this.createUserProvider.createUser(createUserDto);
  }

  /**
   *  The method to get all the users from the database
   */
  public findAll(
    getUserParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
    throw new HttpException(
      {
        status: HttpStatus.MOVED_PERMANENTLY,
        error: 'The API endpoint does not exist',
        fileName: 'user.service.ts',
        lineNumber: 50,
      },
      HttpStatus.MOVED_PERMANENTLY,
      {
        cause: new Error(),
        description: 'Occured because the API endpoint was permanently moved',
      },
    );
  }

  /**
   *  Find a single user by the id
   */
  public async findOneById(id: number) {
    let user: User | null = null;
    try {
      user = await this.usersRepository.findOneBy({ id });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        { description: 'Error connecting to the database' },
      );
    }

    if (!user) {
      throw new NotFoundException('User with this id was not found');
    }
    return user;
  }

  /**
   * Find a single user by email
   */

  public async findOneByEmail(email: string) {
    const user = await this.usersRepository.findOneBy({ email });
    if (!user)
      throw new NotFoundException('User with this email does not exist!');

    return user;
  }

  public async findOneByGoogleId(googleId: string) {
    return await this.usersRepository.findOneBy({ googleId });
  }

  public async createMany(createManyUsersDto: CreateManyUsersDto) {
    return await this.usersCreateManyProvider.createMany(createManyUsersDto);
  }

  public async createGoogleUser(googleUser: GoogleUser) {
    const user = this.usersRepository.create(googleUser);
    return await this.usersRepository.save(user);
  }
}
