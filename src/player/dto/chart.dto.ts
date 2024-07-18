import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';


export class ChartDto {
  players: Array<PlayerChartDto>
  dates: Array<string>
}


export class PlayerChartDto {
  name: string
  img: string
  goals?: Array<number>;
}

