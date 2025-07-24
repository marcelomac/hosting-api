import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { MovimentService } from './moviment.service';
import { CreateMovimentDto } from './dto/create-moviment.dto';
import { UpdateMovimentDto } from './dto/update-moviment.dto';
import { Role } from 'src/decorators/role.decorator';
import { Roles } from 'src/user/user.service';
import { JwtGuard } from 'src/guards/jwt.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { debugLog } from 'src/helpers/utils/debugLog';

@Controller('moviment')
@Role(Roles.ADMIN)
@UseGuards(JwtGuard, RoleGuard)
export class MovimentController {
  constructor(private readonly movimentService: MovimentService) {}

  @Post()
  create(@Body() createMovimentDto: CreateMovimentDto) {
    return this.movimentService.create(createMovimentDto);
  }

  @Get('/composed')
  findAllComposed() {
    return this.movimentService.findAllComposed();
  }

  @Get()
  findAll(@Query('status') status?: string) {
    return this.movimentService.findAll(status);
  }

  @Get('select')
  findSelect() {
    return null; //this.movimentService.findSelect();
  }

  @Get('last-number')
  getMovimentLastNumber(): Promise<number> {
    return this.movimentService.getMovimentLastNumber();
  }

  @Get('by-status')
  getMovimentByStatus(
    @Query('status') status?: string,
  ): Promise<CreateMovimentDto[]> {
    return this.movimentService.getMovimentByStatus(status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movimentService.findMovimentById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMovimentDto: UpdateMovimentDto,
  ) {
    return this.movimentService.update(id, updateMovimentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.movimentService.remove(id);
  }

  @Post('create-ids')
  createMovimentsByOrdinanceIds(@Body('ordinanceIds') ordinanceIds: string[]) {
    return this.movimentService.createMovimentsByOrdinanceIds(ordinanceIds);
  }

  @Post('create-status')
  async createMovimentsByOrdinanceStatus(@Body('status') status: string) {
    const result =
      await this.movimentService.createMovimentsByOrdinanceStatus(status);

    debugLog('result: ', result);
    return result;
  }
}
