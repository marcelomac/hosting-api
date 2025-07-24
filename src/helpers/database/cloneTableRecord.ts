import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function cloneTableRecord(
  table: string,
  id: string,
  fieldname: string,
) {
  try {
    // Find the record to clone
    const recordToClone = await prisma[table].findUnique({
      where: { id },
    });

    if (!recordToClone) {
      throw new Error(`Record with id ${id} not found in table ${table}`);
    }

    console.log('recordToClone: ', recordToClone);

    delete recordToClone.id;

    // Create a new record with the cloned data
    const clonedRecord = await prisma[table].create({
      data: {
        ...recordToClone,
        [fieldname]: `${recordToClone[fieldname]} (copy)`,
      },
    });

    return clonedRecord;
  } catch (error) {
    console.error(`Error cloning record: ${error}`);
    throw error;
  }
}
