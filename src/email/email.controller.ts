import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Res,
  HttpStatus,
  Patch,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EmailService } from './email.service';
import { Response } from 'express';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { Role } from 'src/decorators/role.decorator';
import { Roles } from 'src/user/user.service';
import { JwtGuard } from 'src/guards/jwt.guard';
import { RoleGuard } from 'src/guards/role.guard';

@Controller('email')
@Role(Roles.ADMIN)
@UseGuards(JwtGuard, RoleGuard)
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post()
  create(@Body() createEmailDto: CreateEmailDto) {
    return this.emailService.create(createEmailDto);
  }

  @Post('create-by-moviment')
  createMailByMoviment(
    @Body()
    movimentId?: string[],
  ) {
    return this.emailService.createMailToEmployeeByMoviment(movimentId);
  }

  @Post('send')
  sendEmailById(
    @Body()
    emailIds: string[],
  ) {
    return this.emailService.sendEmailById(emailIds);
  }

  @Get('by-status')
  getEmailByStatus(
    @Query('status') status?: string,
  ): Promise<CreateEmailDto[]> {
    return this.emailService.getEmailByStatus(status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.emailService.findEmailById(id);
  }

  @Get()
  findAll() {
    return this.emailService.findAll();
  }

  @Get(':image')
  async getFile(@Param('filename') filename: string, @Res() res: Response) {
    try {
      const file = await this.emailService.getImage(filename);
      res.status(HttpStatus.OK).send(file);
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'File not found' });
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmailDto: UpdateEmailDto) {
    return this.emailService.update(id, updateEmailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.emailService.remove(id);
  }
}
