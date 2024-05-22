import { Module } from '@nestjs/common';
import { SeasonService } from './season.service';
import { SeasonController } from './season.controller';
import { PrismaService } from 'src/prisma.service';
import { GameDayService } from 'src/game-day/game-day.service';
import { PlayerService } from 'src/player/player.service';

@Module({
  controllers: [SeasonController],
  providers: [SeasonService, PrismaService, GameDayService, PlayerService],
})
export class SeasonModule {}
