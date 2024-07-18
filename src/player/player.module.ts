import { Module } from '@nestjs/common';
import { PlayerService } from './player.service';
import { PlayerController } from './player.controller';
import { PrismaService } from 'src/prisma.service';
import { GameDayService } from 'src/game-day/game-day.service';
import { GoalService } from '../goal/goal.service';

@Module({
  controllers: [PlayerController],
  providers: [PlayerService, PrismaService, GameDayService, GoalService],
})
export class PlayerModule {}


