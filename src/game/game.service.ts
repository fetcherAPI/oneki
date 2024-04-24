import { Injectable } from '@nestjs/common';
import { CreateGameDto, GoalDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { PrismaService } from 'src/prisma.service';

interface ICreateGame {
  dto: CreateGameDto;
  goals1: Array<GoalDto>;
  goals2: Array<GoalDto>;
  gameDayId: string;
}

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {}

  create(createGameDto: ICreateGame) {
    const { dto, goals1, goals2, gameDayId } = createGameDto;
    const fTeamGCount = goals1.reduce((acc, curr) => (acc += curr.count), 0);

    const sTeamGCount = goals2.reduce((acc, curr) => (acc += curr.count), 0);

    const game = {
      createdDate: dto.createdDate,
      firstTeamId: dto.firstTeamId,
      secondTeamId: dto.secondTeamId,
      fTeamGcount: fTeamGCount,
      sTeamGcount: sTeamGCount,
      gameDayId,
    };

    return this.prisma.game.create({ data: game });
  }
  findAll() {
    const games = this.prisma.game.findMany({
      include: {
        firstTeam: true,
        secondTeam: true,
        goals: true,
      },
    });
    return games;
  }

  async findOne(id: string) {
    const game = await this.prisma.game.findUnique({
      where: {
        id,
      },
      include: {
        firstTeam: true,
        secondTeam: true,
        goals: true,
      },
    });

    return game;
  }

  update(id: string, dto: UpdateGameDto) {
    const fTeamGcount = dto.goals1.reduce(
      (acc, curr) => (acc += curr.count),
      0,
    );

    const sTeamGcount = dto.goals2.reduce(
      (acc, curr) => (acc += curr.count),
      0,
    );
    return this.prisma.game.update({
      where: {
        id,
      },
      data: {
        firstTeamId: dto.firstTeamId,
        secondTeamId: dto.secondTeamId,
        fTeamGcount,
        sTeamGcount,
      },
    });
  }

  remove(id: string) {
    return this.prisma.game.delete({
      where: {
        id,
      },
    });
  }

  async getTeams() {
    console.log('fdsafds', this.prisma.team.findMany());
    return await this.prisma.team.findMany();
  }
}
