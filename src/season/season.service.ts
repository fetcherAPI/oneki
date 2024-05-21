import { Injectable } from '@nestjs/common';
import { CreateSeasonDto } from './dto/create-season.dto';
import { UpdateSeasonDto } from './dto/update-season.dto';
import { PrismaService } from 'src/prisma.service';
import { GameDayService } from 'src/game-day/game-day.service';
import * as dayjs from 'dayjs';
import 'dayjs/locale/ru';

@Injectable()
export class SeasonService {
  constructor(
    private prisma: PrismaService,
    private gameDay: GameDayService,
  ) {}
  create(dto: CreateSeasonDto) {
    const { name } = dto;
    return this.prisma.season.create({
      data: {
        ...dto,
        name:
          name ||
          `Игровые дни с ${dayjs(dto.startDate).format('dddd/MMMM/YYYY')} по ${dayjs(dto.startDate).format('dddd/MMMM/YYYY')}`,
      },
    });
  }

  findAll() {
    return this.prisma.season.findMany();
  }

  async findOne(id: string) {
    const season = await this.prisma.season.findUnique({ where: { id } });
    const gameDays = await this.gameDay.findBetweenDates(season.startDate, season.expiredDate);
    return gameDays;
  }

  update(id: string, dto: UpdateSeasonDto) {
    return this.prisma.season.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  remove(id: string) {
    return this.prisma.season.delete({
      where: {
        id,
      },
    });
  }
}
