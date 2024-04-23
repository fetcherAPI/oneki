import { PartialType } from '@nestjs/swagger';
import { CreateGameDayDto } from './create-game-day.dto';

export class UpdateGameDayDto extends PartialType(CreateGameDayDto) {}
