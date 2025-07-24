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
import { ScriptService } from './script.service';
import { CreateScriptDto } from './dto/create-script.dto';
import { UpdateScriptDto } from './dto/update-script.dto';
import { Role } from 'src/decorators/role.decorator';
import { Roles } from 'src/user/user.service';
import { JwtGuard } from 'src/guards/jwt.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { formatISO } from 'date-fns';

@Controller('script')
@Role(Roles.ADMIN)
@UseGuards(JwtGuard, RoleGuard)
export class ScriptController {
  constructor(private scriptService: ScriptService) {}

  @Post('create-ids')
  async createScriptByMovimentIds(@Body('movimentIds') movimentIds: string[]) {
    const scripts =
      await this.scriptService.createScriptByMovimentIds(movimentIds);

    const fixedScripts = scripts.map((script) => {
      return {
        ...script,
        statusDate: formatISO(new Date(script.statusDate)),
        createdAt: formatISO(new Date(script.createdAt)),
      };
    });

    this.scriptService.saveLdapScriptsToFile(fixedScripts);
    return scripts;
  }

  @Post('create-status')
  async createScriptByMovimentStatus(@Body('status') status: string) {
    const scripts =
      await this.scriptService.createScriptByMovimentStatus(status);

    if (!scripts) {
      return null;
    }

    const fixedScripts = scripts.map((script) => {
      return {
        ...script,
        statusDate: formatISO(new Date(script.statusDate)),
        createdAt: formatISO(new Date(script.createdAt)),
      };
    });

    this.scriptService.saveLdapScriptsToFile(fixedScripts);
    return scripts;
  }

  @Get('execute-status')
  async executeScriptByStatus() {
    return this.scriptService.executeScriptByStatus();
  }

  @Post()
  create(@Body() createScriptDto: CreateScriptDto) {
    return this.scriptService.create(createScriptDto);
  }

  @Get()
  findAll(
    @Query('filterName') filterName?: string,
    @Query('filterValue') filterValue?: string,
  ) {
    return this.scriptService.findAll(filterName, filterValue);
  }

  @Get('by-status')
  getScriptByStatus(
    @Query('status') status?: string,
  ): Promise<CreateScriptDto[]> {
    return this.scriptService.getScriptByStatus(status);
  }

  @Get('script-resource')
  getScriptAndResource(@Query('status') status?: string) {
    return this.scriptService.getScriptAndResource(status);
  }

  @Get('select')
  findSelect() {
    return null; //this.scriptService.findSelect();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scriptService.findScriptById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateScriptDto: UpdateScriptDto) {
    return this.scriptService.update(id, updateScriptDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scriptService.remove(id);
  }
}
