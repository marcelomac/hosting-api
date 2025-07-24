import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  UploadedFile,
  UseInterceptors,
  Res,
  HttpStatus,
  UseGuards,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { join, extname } from 'path';
import { mkdirSync, existsSync } from 'fs';
import { JwtGuard } from 'src/guards/jwt.guard';

@Controller('upload')
@UseGuards(JwtGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post(':subfolder')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, callback) => {
          const subfolder = req.params.subfolder; // Getting subfolder from request parameters
          const destinationPath = join('./uploads', subfolder);

          if (!existsSync(destinationPath)) {
            mkdirSync(destinationPath, { recursive: true });
          }

          callback(null, destinationPath);
        },
        filename: (req, file, callback) => {
          const randomName = Array(12)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          callback(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('subfolder') subfolder: string,
    @Res() res: Response,
  ) {
    if (!file) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'No file uploaded' });
    }
    return res.status(HttpStatus.OK).json({
      message: 'File uploaded successfully',
      newFilename: file.filename,
    });
  }

  @Get(':subfolder/:filename')
  async getFile(
    @Param('subfolder') subfolder: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    try {
      const file = await this.uploadService.getFile(filename, subfolder);
      res.status(HttpStatus.OK).send(file);
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'File not found' });
    }
  }

  @Patch(':subfolder')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, callback) => {
          const subfolder = req.params.subfolder; // Getting subfolder from request parameters
          const destinationPath = join('./uploads', subfolder);

          if (!existsSync(destinationPath)) {
            mkdirSync(destinationPath, { recursive: true });
          }

          callback(null, destinationPath);
        },
        filename: (req, file, callback) => {
          const randomName = Array(12)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          callback(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  updateFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('subfolder') subfolder: string,
    @Body('oldFilename') oldFilename: string,
    @Res() res: Response,
  ) {
    if (!file) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'No file uploaded' });
    }
    if (oldFilename) {
      this.uploadService.deleteFile(oldFilename, subfolder);
    }
    return res.status(HttpStatus.OK).json({
      message: 'File updated successfully',
      newFilename: file.filename,
    });
  }

  @Delete(':subfolder/:filename')
  async deleteFile(
    @Param('subfolder') subfolder: string,
    @Param('filename') filename: string,
  ) {
    await this.uploadService.deleteFile(filename, subfolder);
    return {
      message: 'File deleted successfully',
    };
  }
}
