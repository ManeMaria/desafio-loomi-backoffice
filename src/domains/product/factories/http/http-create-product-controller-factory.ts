import {
  PrismaGetProductByNameRepository,
  PrismaSaveProductRepository,
} from '@/domains/product/infra/prisma/repositories';
import {
  makeCreateProductValidation,
} from '@/domains/product/interface/validation';
import {
  HttpCreateProductController,
} from '@/domains/product/interface/http';


import { UUIDGeneratorAdapter } from '@/shared/infra/uuid';

export const makeHttpCreateProductController = (): HttpCreateProductController => {
  const getProductByNameRepository = new PrismaGetProductByNameRepository();
  const saveProductRepository = new PrismaSaveProductRepository();

  const uuidGenerator = new UUIDGeneratorAdapter();
  const validation = makeCreateProductValidation();


  return new HttpCreateProductController(
      getProductByNameRepository,
      saveProductRepository,
      uuidGenerator,
      validation,

  );
};
