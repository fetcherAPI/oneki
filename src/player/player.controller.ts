import { Player } from './entities/player.entity';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { PlayerService } from './player.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PlayerDto } from './dto/player.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Request } from 'express';
import { sendMessageToTelegram } from 'src/coinfig/telegram.config';

@Controller('player')
@ApiTags('player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post()
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({
    summary: `content type form data form.append {
    nickName,
    name,
    id: if player gona updating,
    birthDate, 
  }`,
  })
  @UseInterceptors(
    FileInterceptor('img', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          console.log('file', req);
          const fileNameSplit = file.originalname.split('.');
          const fileExt = fileNameSplit[fileNameSplit.length - 1];
          cb(null, `${Date.now()}.${fileExt}`);
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Body()
    body: {
      createPlayerDto: string;
    },
  ) {
    console.log('createPlayerDto', body.createPlayerDto);
    const { nickname, name, id, birthDate } = JSON.parse(body.createPlayerDto);

    const fileUrl = file ? `/uploads/${file?.filename}` : '';
    if (id) {
      return await this.playerService.update(id, {
        name,
        nickname,
        imgUrl: fileUrl,
        birthDate,
      });
    }
    return await this.playerService.create(
      {
        name,
        nickname,
        birthDate,
      },
      fileUrl,
    );
  }

  @Get('players')
  @ApiOkResponse({
    type: PlayerDto,
    isArray: true,
  })
  async findAll(@Req() req: Request) {
    await sendMessageToTelegram(`Ктото запросил список игроков - ${req.ip},`);
    return this.playerService.findAll();
  }

  @Get('chart')
  @ApiOkResponse({
    type: PlayerDto,
    isArray: true,
  })
  async chart(@Req() req: Request) {
    // await sendMessageToTelegram(`Ктото запросил список игроков - ${req.ip},`);
    return this.playerService.playersChart();
  }
  @Get(':id')
  @ApiOkResponse({
    type: PlayerDto,
  })
  async findOne(@Param('id') id: string, @Req() req: Request) {
    const clienIp = req.ip;
    const player = await this.playerService.findOne(id);
    await sendMessageToTelegram(
      `Ктото запросил детальные данные игрока - ${clienIp}, ${player.name}`,
    );
    return player;
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePlayerDto: UpdatePlayerDto) {
  //   return this.playerService.update(id, updatePlayerDto);
  // }

  @Delete(':id')
  @Auth()
  @ApiBearerAuth()
  async remove(@Param('id') id: string) {
    return await this.playerService.remove(id);
  }
}
