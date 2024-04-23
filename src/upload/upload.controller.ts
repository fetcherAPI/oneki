import {
  Body,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Request } from 'express';
import { CreatePlayerDto } from 'src/player/dto/create-player.dto';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}
  @Post()
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
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Body() createPlayerDto: CreatePlayerDto,
  ) {
    console.log('file', createPlayerDto);
    const fileUrl = `/uploads/${file.filename}`;
    return {
      message: 'Файл успешно загружен',
      fileUrl,
    };
  }
}
