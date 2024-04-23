import { Injectable } from '@nestjs/common';
import { hash } from 'argon2';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  getById(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  // getByEmail(email: string) {
  //   return this.prisma.user.findUnique({
  //     where: {
  //       email,
  //     },
  //   });
  // }

  getByName(name: string) {
    return this.prisma.user.findUnique({
      where: {
        name,
      },
    });
  }

  async create(dto: AuthDto) {
    const user = {
      email: dto?.email,
      name: dto.name,
      password: await hash(dto.password),
    };

    return this.prisma.user.create({
      data: user,
    });
  }
}
