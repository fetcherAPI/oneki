import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { AuthDto } from './dto/auth.dto';
import { verify } from 'argon2';
import { Response } from 'express';

@Injectable()
export class AuthService {
  EXPIRE_DAY_REFRESH_TOKEN = 1;
  REFRESH_TOKEN_NAME = 'refreshToken';

  constructor(
    private jwt: JwtService,
    private userService: UserService,
  ) {}

  async login(dto: AuthDto) {
    const { password, ...user } = await this.validateUser(dto);
    const tokens = this.issueTokens(user.id);
    return {
      user,
      ...tokens,
    };
  }

  async register(dto: AuthDto) {
    const isUserExist = await this.userService.getByName(dto.name);

    if (isUserExist) throw new BadRequestException('user already exists');

    const { password, ...user } = await this.userService.create(dto);

    const tokens = this.issueTokens(user.id);

    return {
      user,
      ...tokens,
    };
  }

  private issueTokens(userId: string) {
    const data = { id: userId };

    const accessToken = this.jwt.sign(data, {
      expiresIn: '1h',
    });

    const refreshToken = this.jwt.sign(data, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  private async validateUser(dto: AuthDto) {
    const user = await this.userService.getByName(dto.name);

    if (!user) throw new NotFoundException('user not found');

    const isValid = await verify(user.password, dto.password);

    if (!isValid) throw new UnauthorizedException('invalid password');

    return user;
  }

  addRefreshTokenToResponse(res: Response, refreshToken: string) {
    const expiresIn = new Date();
    console.log('refreshToken', refreshToken);

    expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN);

    res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
      httpOnly: true,
      domain: 'http://10.100.4.156/',
      expires: expiresIn,
      secure: true,
      sameSite: 'none',
    });
  }

  removeRefreshTokenToResponse(res: Response) {
    const expiresIn = new Date();

    expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN);

    res.cookie(this.REFRESH_TOKEN_NAME, '', {
      httpOnly: true,
      domain: 'http://10.100.4.156/',
      expires: new Date(0),
      secure: true,
      sameSite: 'none',
    });
  }

  async refreshTokens(refreshToken: string) {
    try {
      const result = await this.jwt.verifyAsync(refreshToken);
      if (!result) throw new UnauthorizedException('Invalid refresh token');

      const { password, ...user } = await this.userService.getById(result.id);

      const tokens = this.issueTokens(user.id);
      return {
        user,
        ...tokens,
      };
    } catch (err) {
      throw new UnauthorizedException('invalid token ');
    }
  }
}
