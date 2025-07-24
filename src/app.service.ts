import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClient } from '@prisma/client';
import { UserService } from './user/user.service';

// type EmployeeList = {
//   employeeId: string;
//   departmentId: string;
//   relationshipId: string;
// };

@Injectable()
export class AppService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  // async queryData(
  //   table: string,
  //   operation: string,
  //   query: object,
  // ): Promise<typeof PrismaClient | null> {
  //   const prismaClient = this.prisma[table];
  //   const result = await prismaClient[operation](query);
  //   return result;
  // }

  // async updateMovimentNumber() {
  //   const moviments = await this.prisma.moviment.findMany({
  //     where: {
  //       number: {
  //         startsWith: '77',
  //       },
  //     },
  //     orderBy: {
  //       number: 'asc',
  //     },
  //   });

  //   let nStart = 24182;
  //   const promises = moviments.map(async (moviment) => {
  //     const number = moviment.number.toString().padStart(5, '0');

  //     const newNumber = (nStart++).toString().padStart(5, '0');
  //     console.log('number: ', number, '- new number: ', newNumber);

  //     return await this.prisma.moviment.update({
  //       where: {
  //         id: moviment.id,
  //       },
  //       data: {
  //         number: newNumber,
  //       },
  //     });
  //   });

  //   return await Promise.all(promises);
  // }

  // async createMoviment() {
  //   const employeeList = [
  //     {
  //       employeeId: '8y751ufgx2vjff53qea8tg5i8',
  //       departmentId: '34hafxzeonmlm5ktjoo7e4xk9',
  //     },
  //     {
  //       employeeId: 'gwiaemtdj4gzwhre69tuyfr3t',
  //       departmentId: 'gisvcwar2fshovx9eg2hyolk1',
  //     },
  //   ];

  //   let number = 99140;

  //   const promises = employeeList.map(async (employee) => {
  //     return {
  //       number: (number++).toString().padStart(5, '0'),
  //       employeeId: employee.employeeId,
  //       departmentId: employee.departmentId,
  //       relationshipId: 'cly48lh7b000btlx78rgqemeg',
  //       ordinanceId: 'cm4xcsjle01h771gv9njdvknc',
  //       movimentType: 'Exoneração',
  //       date: '2024-12-20T00:00:00.000Z',
  //       origin: 'Manual',
  //       status: 'Concluído',
  //       statusDate: new Date(),
  //       annotation: '',
  //       compliance: true,
  //     };
  //   });

  //   Promise.all(promises).then(async (moviment) => {
  //     return await this.prisma.moviment.createMany({
  //       data: moviment,
  //       skipDuplicates: false,
  //     });
  //   });
  // }
}
