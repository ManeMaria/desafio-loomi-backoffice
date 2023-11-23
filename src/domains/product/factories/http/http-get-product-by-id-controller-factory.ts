import {
  PrismaGetProductByIdRepository,
} from '@/domains/product/infra/prisma/repositories';
import {
  makeGetProductByIdValidation,
} from '@/domains/product/interface/validation';
import {
  HttpGetProductByIdController,
} from '@/domains/product/interface/http';



export const makeHttpGetProductByIdController = (): HttpGetProductByIdController => {
  const getProductByIdRepository = new PrismaGetProductByIdRepository();
  const validation = makeGetProductByIdValidation();


  return new HttpGetProductByIdController(
    getProductByIdRepository,
    validation,

  );
};
