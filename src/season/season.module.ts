import { Module } from '@nestjs/common';
import { SeasonService } from './season.service';
import { SeasonController } from './season.controller';
import { PrismaService } from 'src/prisma.service';
import { GameDayService } from 'src/game-day/game-day.service';

@Module({
  controllers: [SeasonController],
  providers: [SeasonService, PrismaService, GameDayService],
})
export class SeasonModule {}
