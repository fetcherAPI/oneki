import { ApiProperty, ApiBearerAuth } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateGameDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'firstTeamId не должен быть пустым' })
  firstTeamId: string;
  @IsNotEmpty({ message: 'secondTeamId не должен быть пустым' })
  @ApiProperty()
  secondTeamId: string;
  @IsNotEmpty({ message: 'goals1 не должен быть пустым' })
  @IsArray()
  @ValidateNested({ each: true })
  @ApiProperty({
    type: () => GoalDto,
    isArray: true,
    description: 'Array of goals',
    example: [
      {
        playerId: '0820638f-65d9-4e73-bee2-03bcbcbd2c32',
        count: 5,
      },
    ],
  })
  @Type(() => GoalDto)
  goals1: Array<GoalDto>;
  @IsNotEmpty({ message: 'goals2 не должен быть пустым' })
  @IsArray()
  @ValidateNested({ each: true })
  @ApiProperty({
    type: () => GoalDto,
    isArray: true,
    description: 'Array of goals',
    example: [
      {
        playerId: '0820638f-65d9-4e73-bee2-03bcbcbd2c32',
        count: 5,
      },
    ],
  })
  @Type(() => GoalDto)
  goals2: Array<GoalDto>;
}

export class GoalDto {
  @IsNotEmpty({ message: 'playerId не должен быть пустым' })
  playerId;
  @IsNotEmpty({ message: 'count не должен быть пустым' })
  count: number;
}
