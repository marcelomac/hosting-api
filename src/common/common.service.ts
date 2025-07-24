import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommonService {
  constructor(private prisma: PrismaService) {}

  async cloneTableRecord(table: string, ids: string[], fieldname: string) {
    try {
      const promises = ids.map(async (id) => {
        // Find the record to clone
        const recordToClone = await this.prisma[table].findUnique({
          where: { id },
        });

        if (!recordToClone) {
          throw new Error(`Record with id ${id} not found in table ${table}`);
        }

        console.log('recordToClone: ', recordToClone);

        delete recordToClone.id;

        // Create a new record with the cloned data
        const clonedRecord = await this.prisma[table].create({
          data: {
            ...recordToClone,
            [fieldname]: `${recordToClone[fieldname]} (clone)`,
          },
        });

        return clonedRecord;
      });

      // Aguarda a resolução de todas as promises
      Promise.all(promises)
        .then(async (promise) =>
          promise.filter((promise) => promise !== undefined),
        )
        .then(async (promise) => {
          await this.prisma[table].createMany({
            data: promise.flat(),
            skipDuplicates: true,
          });
        });
    } catch (error) {
      console.error(`Error cloning record: ${error}`);
      throw error;
    }
  }
}
