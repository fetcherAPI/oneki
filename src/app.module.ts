import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { GameModule } from './game/game.module';
import { GoalModule } from './goal/goal.module';
import { PlayerModule } from './player/player.module';
import { UploadModule } from './upload/upload.module';
import { GameDayModule } from './game-day/game-day.module';
import { SeasonModule } from './season/season.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UserModule,
    GameModule,
    GoalModule,
    PlayerModule,
    UploadModule,
    GameDayModule,
    SeasonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
