import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsISO8601, IsNotEmpty } from 'class-validator';

export class CreateSeasonDto {
  @ApiProperty({ default: '2024-03-28T11:23:42.000Z', description: 'required' })
  @IsISO8601()
  @IsNotEmpty({ message: 'startDate не должен быть пустым' })
  startDate: Date;
  @ApiProperty({ default: '2024-03-28T11:23:42.000Z', description: 'required' })
  @IsISO8601()
  @IsNotEmpty({ message: 'expiredDate не должен быть пустым' })
  expiredDate: Date;
  @ApiProperty({ default: 'название сезона' })
  name?: string;
}
