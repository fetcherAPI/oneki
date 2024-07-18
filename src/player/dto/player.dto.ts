import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PlayerDto {
  @ApiProperty({ default: 'uuid' })
  id: string;
  @ApiProperty({ default: 'ISODate' })
  createdDate: Date;
  @ApiProperty({ default: 'ISODate' })
  updatedDate: Date;
  @ApiProperty({ default: 'name' })
  name: string;
  @ApiProperty({ default: 'nickname' })
  nickname: string;
  @ApiProperty({ default: 'url' })
  imagePath: string;
  @ApiProperty({
    type: () => GoalDto,
    isArray: true,
    example: [
      {
        scoredDate: 'ISODate',
        forTeam: 'for team name',
        vsTeam: 'vs team name',
        count: 4,
      },
    ],
  })
  @Type(() => GoalDto)
  goals?: Array<GoalDto>;
  goalsCount?: number;
  lastGameDayGoalCount?: any;
  goalPercentage: string;
}

export class GoalDto {
  @ApiProperty({ default: 'ISODate' })
  scoredDate: Date;
  @ApiProperty({ default: 'for team name' })
  forTeam: string;
  @ApiProperty({ default: 'vs team name' })
  vsTeam: string;
  @ApiProperty({ default: 2 })
  count: number;
}
