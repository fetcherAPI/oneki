import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UnprocessableEntityException,
  Put,
} from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { GoalService } from 'src/goal/goal.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GameDayService } from 'src/game-day/game-day.service';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('game')
@ApiTags('game')
export class GameController {
  constructor(
    private readonly gameService: GameService,
    private readonly goalService: GoalService,
    private readonly gameDayService: GameDayService,
  ) {}
  @Get('teams')
  async getTeams() {
    return await this.gameService.getTeams();
  }
  @Post()
  @Auth()
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  async create(@Body() dto: CreateGameDto) {
    const gameDayId = await this.gameDayService.findOne(dto.createdDate);
    const game = await this.gameService.create({
      dto,
      goals1: dto.goals1,
      goals2: dto.goals2,
      gameDayId,
    });
    try {
      const goals1Promises = dto.goals1.map((el) =>
        this.goalService.create({
          scoredDate: new Date(game.createdDate),
          playerId: el.playerId,
          forTeamId: dto.firstTeamId,
          toTeamId: dto.secondTeamId,
          gameId: game.id,
          count: el.count,
        }),
      );
      const goals2Promises = dto.goals2.map((el) =>
        this.goalService.create({
          scoredDate: new Date(game.createdDate),
          playerId: el.playerId,
          forTeamId: dto.secondTeamId,
          toTeamId: dto.firstTeamId,
          gameId: game.id,
          count: el.count,
        }),
      );
      await Promise.all([...goals1Promises, ...goals2Promises]);
      return game;
    } catch (err) {
      throw new UnprocessableEntityException('Error while goals');
    }
  }

  // @Get('gameResults')
  // findAll() {
  //   return this.gameService.findAll();
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gameService.findOne(id);
  }

  @Put(':id')
  @Auth()
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  async update(@Param('id') id: string, @Body() dto: UpdateGameDto) {
    const game = await this.gameService.findOne(id);
    await this.goalService.deleteAllGoalsByGameId(id);
    const goals1Promises = dto.goals1.map((el) =>
      this.goalService.create({
        scoredDate: new Date(game.createdDate),
        playerId: el.playerId,
        forTeamId: dto.firstTeamId,
        toTeamId: dto.secondTeamId,
        gameId: game.id,
        count: el.count,
      }),
    );
    const goals2Promises = dto.goals2.map((el) =>
      this.goalService.create({
        scoredDate: new Date(game.createdDate),
        playerId: el.playerId,
        forTeamId: dto.secondTeamId,
        toTeamId: dto.firstTeamId,
        gameId: game.id,
        count: el.count,
      }),
    );
    await Promise.all([...goals1Promises, ...goals2Promises]);
    return this.gameService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Auth()
  remove(@Param('id') id: string) {
    return this.gameService.remove(id);
  }
}
