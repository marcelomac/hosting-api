import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrdinanceService } from './ordinance.service';
import { CreateOrdinanceDto } from './dto/create-ordinance.dto';
import { UpdateOrdinanceDto } from './dto/update-ordinance.dto';
import { Role } from 'src/decorators/role.decorator';
import { Roles } from 'src/user/user.service';
import { JwtGuard } from 'src/guards/jwt.guard';
import { RoleGuard } from 'src/guards/role.guard';

@Controller('ordinance')
@Role(Roles.ADMIN)
@UseGuards(JwtGuard, RoleGuard)
export class OrdinanceController {
  constructor(private readonly ordinanceService: OrdinanceService) {}

  @Post()
  create(@Body() createOrdinanceDto: CreateOrdinanceDto) {
    return this.ordinanceService.create(createOrdinanceDto);
  }

  @Get()
  findAll() {
    return this.ordinanceService.findAll();
  }

  @Get('by-status')
  getOrdinanceByStatus(
    @Query('status') status?: string,
  ): Promise<CreateOrdinanceDto[]> {
    return this.ordinanceService.getOrdinanceByStatus(status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordinanceService.findOneById(id);
  }

  @Get(':number')
  findOneByNumber(@Param('number') number: string) {
    return this.ordinanceService.findOneByNumber(number);
  }

  @Patch('updateMany')
  updateMany(@Body() updateBody: { where: object; data: object }) {
    const where = updateBody.where;
    const data = updateBody.data;
    return this.ordinanceService.updateMany(where, data);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrdinanceDto: UpdateOrdinanceDto,
  ) {
    return this.ordinanceService.update(id, updateOrdinanceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordinanceService.remove(id);
  }

  /**
   * Busca as portarias no site do Diário Oficial dos Municípios no período informado e
   * gera movimentos para cada portaria encontrada.
   */
  @Get('fetch-ordinance')
  async fetchOrdinance(
    @Query('dataInicial') dataInicial: string,
    @Query('dataFinal') dataFinal: string,
    @Query('number') number: string,
    @Query('searchType') searchType: string,
  ) {
    const response = await this.ordinanceService.fetchOrdinance(
      dataInicial,
      dataFinal,
      number,
      searchType,
    );
    return response;
  }
}
