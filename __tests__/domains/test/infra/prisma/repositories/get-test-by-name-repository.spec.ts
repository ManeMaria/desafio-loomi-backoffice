import { PrismaGetTestByNameRepository } from '@/domains/test';
import { prismaConnector } from '@/shared/infra/prisma/index';

import { mockCreateTestParams } from '@/tests/domains/test/entities/mocks/test-mocks';
import { PrismaClient } from '@prisma/client';

const makeSut = () => {
  const sut = new PrismaGetTestByNameRepository();

  return {
    sut,
  };
}

describe('Prisma Get Test by Name Repository', () => {
  let prismaTest: PrismaClient | null = null;
  beforeEach(async () => {
    prismaTest = prismaConnector.connect(process.env.DATABASE_TEST_URL);

    await prismaTest.test.deleteMany({});
  });

  afterEach(async () => {
    if (prismaTest) {
      await prismaTest.test.deleteMany({});
      await prismaTest.$disconnect();
    }
  });

  it('should list a test by name', async () => {
    const { sut } = makeSut();

    const testCreated = await prismaTest?.test.create({
      data: mockCreateTestParams(),
    });

    const test = await sut.get(testCreated?.name || '');

    expect(test).toHaveProperty('name', testCreated?.name);
    expect(test).toHaveProperty('enabled', testCreated?.enabled);
  });
});
