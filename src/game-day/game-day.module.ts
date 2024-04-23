import { Module } from '@nestjs/common';
import { GameDayService } from './game-day.service';
import { GameDayController } from './game-day.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [GameDayController],
  providers: [GameDayService, PrismaService],
  exports: [GameDayService],
})
export class GameDayModule {}
