import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SeasonService } from './season.service';
import { CreateSeasonDto } from './dto/create-season.dto';
import { UpdateSeasonDto } from './dto/update-season.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';

@ApiTags('season')
@Controller('season')
export class SeasonController {
  constructor(private readonly seasonService: SeasonService) {}

  @Auth()
  @ApiBearerAuth()
  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() dto: CreateSeasonDto) {
    return this.seasonService.create(dto);
  }

  @Get()
  findAll() {
    return this.seasonService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.seasonService.findOne(id);
  }

  @Get('players/:id')
  players(@Param('id') id: string) {
    return this.seasonService.findSeasonPlayers(id);
  }

  @Auth()
  @ApiBearerAuth()
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSeasonDto) {
    return this.seasonService.update(id, dto);
  }

  @Auth()
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.seasonService.remove(id);
  }
}
