import {
  forwardRef,
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { AuthService } from 'src/auth/providers/auth.service';
import jwtConfig from 'src/config/jwt.config';
import { UsersService } from 'src/users/providers/users.service';
import { GoogleTokenDto } from '../dtos/google-token.dto';

@Injectable()
export class GoogleAuthenticationService implements OnModuleInit {
  private oauthClient: OAuth2Client;

  constructor(
    /**
     * Inject jwtConfiguration
     */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

    /**
     * Inject usersService
     */
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    /**
     * Inject authService
     */
    private readonly authService: AuthService,
  ) {}

  onModuleInit() {
    const clientId = this.jwtConfiguration.googleClientId;
    const clientSecret = this.jwtConfiguration.googleClientSecret;

    this.oauthClient = new OAuth2Client(clientId, clientSecret);
  }

  public async authenticate(googleTokenDto: GoogleTokenDto) {
    try {
      // Verify the google token sent by user
      const loginTicket = await this.oauthClient.verifyIdToken({
        idToken: googleTokenDto.token,
      });

      // Extract the payload from google jwt
      const payload = loginTicket.getPayload();
      if (!payload) {
        throw new UnauthorizedException('Invalid Google token');
      }

      const {
        email,
        sub: googleId,
        given_name: firstName,
        family_name: lastName,
      } = payload;

      // Find the user in the database using the googleId
      const user = await this.usersService.findOneByGoogleId(googleId);
      // If googleId exists generate token
      if (user) {
        return this.authService.generateTokens(user);
      }
      // If not create a new user and then generate tokens
      const newUser = await this.usersService.createGoogleUser({
        email: email ?? '',
        firstName: firstName ?? '',
        lastName: lastName ?? '',
        googleId,
      });

      return this.authService.generateTokens(newUser);
      // Throw Unauthorized exception
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
