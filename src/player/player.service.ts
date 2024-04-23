import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { PrismaService } from 'src/prisma.service';
import { PlayerDto } from './dto/player.dto';

@Injectable()
export class PlayerService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePlayerDto, imgUrl: string) {
    const player = await this.prisma.player.findUnique({
      where: {
        nickname: dto.nickname,
      },
    });
    if (player) {
      throw new HttpException(
        'already exist user with this nick ',
        HttpStatus.CONFLICT,
      );
    }
    return this.prisma.player.create({ data: { ...dto, imgUrl } });
  }

  async findAll() {
    const players = await this.prisma.player.findMany({
      include: {
        goals: {
          include: {
            toTeam: true,
            forTeam: true,
          },
        },
      },
    });
    const playersDto: Array<PlayerDto> = players.map((player) => {
      return {
        id: player.id,
        createdDate: player.createdAt,
        updatedDate: player.updatedAt,
        name: player.name,
        nickname: player.nickname,
        imagePath: player.imgUrl,
        goals: player.goals.map((goal) => {
          return {
            scoredDate: goal.scoredDate,
            forTeam: goal.forTeam.name,
            vsTeam: goal.toTeam.name,
            count: goal.count,
          };
        }),
      };
    });
    return playersDto;
  }

  async findOne(id: string) {
    const player = await this.prisma.player.findUnique({
      where: {
        id: id,
      },
      include: {
        goals: {
          include: {
            toTeam: true,
            forTeam: true,
          },
        },
      },
    });

    const playerDto: PlayerDto = {
      id: player.id,
      createdDate: player.createdAt,
      updatedDate: player.updatedAt,
      name: player.name,
      nickname: player.nickname,
      imagePath: player.imgUrl,
      goals: player.goals.map((goal) => {
        return {
          scoredDate: goal.scoredDate,
          forTeam: goal.forTeam.name,
          vsTeam: goal.toTeam.name,
          count: goal.count,
        };
      }),
    };
    return playerDto;
  }

  async update(id: string, dto: UpdatePlayerDto) {
    const player = await this.prisma.player.findUnique({
      where: {
        id,
      },
    });

    if (!player) {
      throw new NotFoundException('player not found');
    }
    return this.prisma.player.update({
      where: {
        id,
      },
      data: {
        nickname: dto.nickname || player.nickname,
        name: dto.name || player.name,
        imgUrl: dto.imgUrl || player.imgUrl,
      },
    });
  }

  remove(id: string) {
    return this.prisma.player.delete({
      where: {
        id,
      },
    });
  }
}
