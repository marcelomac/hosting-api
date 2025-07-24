import { PrismaService } from 'src/prisma/prisma.service';

export async function getEmployeeId(
  prisma: PrismaService,
  employeeName: string,
): Promise<string | null> {
  //const prisma = new PrismaService();

  const textSearch = '%'.concat(employeeName).concat('%');
  const employee = await prisma.employee.findFirst({
    where: {
      name: textSearch,
    },
  });

  await new Promise((resolve) => setTimeout(resolve, 300));
  if (!employee) {
    return null;
  }

  return employee.id;
}
