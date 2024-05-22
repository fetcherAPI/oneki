import { Controller, Delete, Get, Param, Req } from '@nestjs/common';
import { GameDayService } from './game-day.service';
import { ApiBearerAuth, ApiOkResponse, ApiProperty, ApiTags } from '@nestjs/swagger';
import { GameDayDto } from './dto/game-day.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Request } from 'express';
import { sendMessageToTelegram } from 'src/coinfig/telegram.config';
class GameDay {
  @ApiProperty({
    example: '1',
    description: 'Уникальный идентификатор игрового дня',
  })
  id: string;

  @ApiProperty({
    example: '2024-04-16T08:02:17Z',
    description: 'Дата создания',
  })
  createdDate: string;

  @ApiProperty({
    example: '2024-04-16T08:02:17Z',
    description: 'Дата обновления',
  })
  updatedDate: string;
}

@Controller('game-day')
@ApiTags('game-day')
export class GameDayController {
  constructor(private readonly gameDayService: GameDayService) {}

  @Get()
  @ApiOkResponse({
    description: 'array of game days date',
    type: GameDay,
    isArray: true,
  })
  async findAll() {
    return await this.gameDayService.findAll();
  }

  @ApiOkResponse({
    description: 'array of game days date',
    type: GameDayDto,
  })
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: Request) {
    await sendMessageToTelegram(`Ктото запросил: [${req.ip}] игровой день ${id}`);
    return await this.gameDayService.getById(id);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Auth()
  async remove(@Param('id') id: string) {
    return await this.gameDayService.remove(id);
  }
}
