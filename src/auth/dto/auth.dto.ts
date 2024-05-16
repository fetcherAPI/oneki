import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';

export class AuthDto {
  email?: string;

  @ApiProperty({ default: 'name' })
  @IsNotEmpty()
  name: string;
  @IsString()
  @MinLength(6, {
    message: 'must be 6 symbols',
  })
  @ApiProperty({ default: '1234576' })
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty()
  @IsNotEmpty()
  refreshToken: string;
}
