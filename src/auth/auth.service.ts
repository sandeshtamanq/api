import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { UserRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt/dist';
import { jwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentiaDto: AuthCredentialDto): Promise<void> {
    return this.userRepository.signup(authCredentiaDto);
  }

  async signIn(
    authCredentiaDto: AuthCredentialDto,
  ): Promise<{ accessToken: string; username: string }> {
    const username = await this.userRepository.validateUserPassword(
      authCredentiaDto,
    );
    if (!username) {
      throw new HttpException('Incorrect Username or password', 403);
    }

    const payload: jwtPayload = { username };
    const accessToken = await this.jwtService.sign(payload);
    return { accessToken, username };
  }
}
