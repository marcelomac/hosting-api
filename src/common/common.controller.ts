import { Body, Controller, Post } from '@nestjs/common';
import { CommonService } from './common.service';

@Controller('common')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  @Post('clone-record')
  cloneData(
    @Body('table') table: string,
    @Body('ids') ids: string[],
    @Body('fieldname') fieldname?: string,
  ) {
    this.commonService.cloneTableRecord(table, ids, fieldname);
  }
}
