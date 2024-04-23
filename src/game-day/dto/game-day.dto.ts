import { ApiProperty } from '@nestjs/swagger';

export class GameDayDto {
  @ApiProperty({ default: '2024-03-28T11:23:42.000Z', description: 'required' })
  gameDate: string;

  @ApiProperty({
    type: () => GameDto,
    isArray: true,
  })
  gameResults: Array<GameDto>;
}

export class GameDto {
  @ApiProperty({
    type: () => GoalDto,
    isArray: true,
    example: [{ playerId: '1', count: 3 }],
  })
  goals1: Array<GoalDto>;

  @ApiProperty({
    type: () => GoalDto,
    isArray: true,
    example: [{ playerId: '1', count: 3 }],
  })
  goals2: Array<GoalDto>;
  @ApiProperty({ default: '2 - 1' })
  result: string;
  @ApiProperty({ default: 'team1' })
  team1: string;
  @ApiProperty({ default: 'team2' })
  team2: string;
  @ApiProperty({ default: 'uuid' })
  _id: string;
}

class GoalDto {
  @ApiProperty({ default: '1' })
  playerId: string;
  @ApiProperty({ default: 3 })
  count: number;
}
