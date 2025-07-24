import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';

import { GetUser } from 'src/decorators/getUser.decorator';
import { ProfileService } from './profile.service';
import { JwtGuard } from 'src/guards/jwt.guard';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import path, { join } from 'path';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  create(@GetUser() user: any) {
    return this.profileService.createProfile(user);
  }

  @UseGuards(JwtGuard)
  @Get()
  getProfile(@GetUser() user: any) {
    return this.profileService.getProfile(user);
  }

  @UseGuards(JwtGuard)
  @Get('avatar')
  async getAvatar(@GetUser() user: any, @Res() res: Response) {
    //const imagePath = await this.profileService.getAvatar(user);
    const filename = 'iconavatar2.png';

    const currentFolder = path.resolve(process.cwd());

    const imagePath = join(currentFolder, 'uploads', 'avatars', filename);

    res.sendFile(imagePath.toString());
  }

  @UseGuards(JwtGuard)
  @Patch()
  update(@GetUser() user: any, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(user, updateProfileDto);
  }
}
