import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { PrismaService } from 'src/prisma.service';
import { PlayerDto } from './dto/player.dto';
import { GoalDto } from './dto/player.dto';
import { GameDayService } from 'src/game-day/game-day.service';
import { ChartDto, PlayerChartDto } from './dto/chart.dto';
import { GoalService } from 'src/goal/goal.service';

@Injectable()
export class PlayerService {
  constructor(
    private prisma: PrismaService,
    private gameDay: GameDayService,
    private goal: GoalService
  ) {}

  private goalsCalc = (goals: Array<GoalDto>) => {
    const uniqueDays = new Set<string>();
    const goalsCount = goals.reduce((acc, curr) => (acc += curr.count), 0);

    goals.forEach((goal) => {
      const year = goal.scoredDate.getFullYear();
      const month = goal.scoredDate.getMonth() + 1;
      const day = goal.scoredDate.getDate();
      const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
      uniqueDays.add(formattedDate);
    });

    // Избегаем деления на ноль

    return uniqueDays.size > 0 ? (goalsCount / uniqueDays.size).toFixed(2) : '0.00';
  };
  private getLastGameDate = async () => {
    return new Date((await this.gameDay.getLastGameDate()).createdDate);
  };

  private filterByScoredDate = async (elements: Array<GoalDto>) => {
    const results = await Promise.all(
      elements.map(async (el) => {
        const lastGameDate = await this.getLastGameDate();
        return { element: el, isValid: el.scoredDate >= lastGameDate };
      }),
    );

    return results.filter((result) => result.isValid).map((result) => result.element);
  };

  async create(dto: CreatePlayerDto, imgUrl: string) {
    const player = await this.prisma.player.findUnique({
      where: {
        nickname: dto.nickname,
      },
    });
    if (player) {
      throw new HttpException('already exist user with this nick ', HttpStatus.CONFLICT);
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
      const playerGoals = player.goals.map((goal) => {
        return {
          scoredDate: goal.scoredDate,
          forTeam: goal.forTeam.name,
          vsTeam: goal.toTeam.name,
          count: goal.count,
        };
      });

      return {
        id: player.id,
        createdDate: player.createdAt,
        updatedDate: player.updatedAt,
        name: player.name,
        nickname: player.nickname,
        imagePath: player.imgUrl,
        goalsCount: playerGoals.reduce((acc, curr) => (acc += curr.count), 0),
        goalPercentage: this.goalsCalc(playerGoals),
        lastGameDayGoalCount: this.filterByScoredDate(playerGoals).then((res) => res),
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
    const playerGoals = player.goals.map((goal) => {
      return {
        scoredDate: goal.scoredDate,
        forTeam: goal.forTeam.name,
        vsTeam: goal.toTeam.name,
        count: goal.count,
      };
    });
    const playerDto: PlayerDto = {
      id: player.id,
      createdDate: player.createdAt,
      updatedDate: player.updatedAt,
      name: player.name,
      nickname: player.nickname,
      imagePath: player.imgUrl,
      goals: playerGoals.sort((a, b) => {
        return a.scoredDate > b.scoredDate ? -1 : a.scoredDate < b.scoredDate ? 1 : 0;
      }),
      goalPercentage: this.goalsCalc(playerGoals),
      goalsCount: playerGoals.reduce((acc, curr) => (acc += curr.count), 0),
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

  async findBetweenDates(start, end) {
    const players = await this.prisma.player.findMany({
      include: {
        goals: {
          include: {
            forTeam: true,
            toTeam: true,
          },
          where: {
            scoredDate: {
              gte: new Date(start).toISOString(),
              lte: new Date(end).toISOString(),
            },
          },
        },
      },
    });

    const lastGameDay = await this.gameDay.getLastGameDate();
    const playersDto: Array<PlayerDto> = players.map((player) => {
      const playerGoals = player.goals.map((goal) => {
        return {
          scoredDate: goal.scoredDate,
          forTeam: goal.forTeam.name,
          vsTeam: goal.toTeam.name,
          count: goal.count,
        };
      });
      return {
        id: player.id,
        createdDate: player.createdAt,
        updatedDate: player.updatedAt,
        name: player.name,
        nickname: player.nickname,
        imagePath: player.imgUrl,
        goalsCount: playerGoals.reduce((acc, curr) => (acc += curr.count), 0),
        goalPercentage: this.goalsCalc(playerGoals),
        lastGameDayGoalCount: playerGoals
          .filter(async (el) => el.scoredDate >= (await this.getLastGameDate()))
          .reduce((acc, curr) => (acc += curr.count), 0),
      };
    });
    return playersDto;
  }


  async playersChart ()  {
    const dates = await this.gameDay.findAll()
    const players = await this.findAll()

    const chart: Array<any> =[]

    for (const player of players) {

      const promises = dates.map(date => {
        return this.goal.goalsByDate(date.createdDate, player.id);
      });

      const results   = await Promise.all(promises);


      const playerChartData: PlayerChartDto = {
        name: player.name,
        goals: results.flat()
      }
        chart.push(playerChartData)
    }


    return {
        players:  chart,
        dates: dates.map(el => el.createdDate),
    }

  }
}
