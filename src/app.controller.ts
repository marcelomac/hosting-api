import { Body, Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

// type employeeList = {
//   employeeId: string;
//   departmentId: string;
//   relationshipId: string;
// };

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get()
  // queryData(
  //   @Query('table') table: string,
  //   @Query('operation') operation: string,
  //   @Body() query?: object,
  // ) {
  //   return this.appService.queryData(table, operation, query);
  // }

  // @Get('number')
  // getnumber() {
  //   return this.appService.updateMovimentNumber();
  // }

  // @Post('create-moviment')
  // createMoviment() {
  //   return this.appService.createMoviment();
  // }

  // @Post('clone-record')
  // cloneData(
  //   @Query('table') table: string,
  //   @Query('id') id: string,
  //   @Query('fieldname') fieldname?: string,
  // ) {
  //   cloneTableRecord(table, id, fieldname);
  // }

  // @Delete('deletedata')
  // deleteData(@Query('tables') tables?: string) {
  //   this.appService.deleteData(tables);
  // }
}
