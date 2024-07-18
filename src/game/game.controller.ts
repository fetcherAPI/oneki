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
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto, GoalDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { GoalService } from 'src/goal/goal.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GameDayService } from 'src/game-day/game-day.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Game } from '@prisma/client';

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
      await this.createGoal(game, dto.goals1, dto.firstTeamId, dto.secondTeamId);
      await this.createGoal(game, dto.goals2, dto.secondTeamId, dto.firstTeamId);
      return game;
    } catch (err) {
      throw new UnprocessableEntityException('Error while goals');
    }
  }

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

    if (!game) throw new NotFoundException();

    await this.goalService.deleteAllGoalsByGameId(id);
    try {
      await this.createGoal(game, dto.goals1, dto.firstTeamId, dto.secondTeamId);

      await this.createGoal(game, dto.goals2, dto.secondTeamId, dto.firstTeamId);

      return this.gameService.update(id, dto);
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Auth()
  remove(@Param('id') id: string) {
    return this.gameService.remove(id);
  }

  private async createGoal(game: Game, goals: Array<GoalDto>, forTeamId: string, toTeamId: string) {
    goals.map((el) => {
      return this.goalService.create({
        scoredDate: new Date(game.createdDate),
        playerId: el.playerId,
        forTeamId,
        toTeamId,
        gameId: game.id,
        count: el.count,
      });
    });
  }
}
