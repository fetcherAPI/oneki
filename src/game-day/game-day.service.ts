import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGameDayDto } from './dto/create-game-day.dto';
import { UpdateGameDayDto } from './dto/update-game-day.dto';
import { PrismaService } from 'src/prisma.service';
import { GameDayDto } from './dto/game-day.dto';

@Injectable()
export class GameDayService {
  constructor(private prisma: PrismaService) {}
  create(createGameDayDto: CreateGameDayDto) {
    const gameDay = this.prisma.gameDay.create({ data: createGameDayDto });
    return gameDay;
  }

  findAll() {
    return this.prisma.gameDay.findMany();
  }

  async findOne(date: string) {
    const year = new Date(date).toISOString().substring(0, 10);
    const gameDay = await this.prisma.gameDay.findFirst({
      where: {
        createdDate: year,
      },
    });
    if (gameDay) {
      return gameDay.id;
    } else {
      return (await this.prisma.gameDay.create({ data: { createdDate: year } })).id;
    }
  }

  async getById(id: string) {
    const gameDay = await this.prisma.gameDay.findUnique({
      where: {
        id,
      },
      include: {
        games: {
          include: {
            firstTeam: true,
            secondTeam: true,
            goals: {
              include: {
                toTeam: true,
                forTeam: true,
              },
            },
          },
        },
      },
    });
    if (!gameDay) {
      throw new NotFoundException();
    }
    const gameDayDto: GameDayDto = {
      gameDate: gameDay.createdDate,
      gameResults: gameDay.games.map((game, i) => {
        return {
          goals1: game.goals
            .filter((goal) => {
              return goal.forTeamId === game.firstTeamId;
            })
            .map((goal) => {
              return {
                playerId: goal.playerId,
                count: goal.count,
              };
            }),
          goals2: game.goals
            .filter((goal) => {
              return goal.toTeamId === game.firstTeamId;
            })
            .map((goal) => {
              return {
                playerId: goal.playerId,
                count: goal.count,
              };
            }),
          result: `${game.fTeamGcount} - ${game.sTeamGcount}`,
          team1: game.firstTeam.name,
          team2: game.secondTeam.name,
          _id: game.id,
        };
      }),
    };

    return gameDayDto;
  }
  update(id: number, updateGameDayDto: UpdateGameDayDto) {
    return `This action updates a #${id} gameDay`;
  }

  findBetweenDates(start, end) {
    return this.prisma.gameDay.findMany({
      where: {
        createdDate: {
          gte: new Date(start).toISOString(),
          lte: new Date(end).toISOString(),
        },
      },
    });
  }

  remove(id: string) {
    return this.prisma.gameDay.delete({
      where: {
        id,
      },
    });
  }
}
