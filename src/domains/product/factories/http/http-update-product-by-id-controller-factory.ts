import {
  PrismaGetProductByNameRepository,
  PrismaGetProductByIdRepository,
  PrismaUpdateProductRepository,
} from '@/domains/product/infra/prisma/repositories';
import {
  makeUpdateProductValidation,
} from '@/domains/product/interface/validation';
import {
  HttpUpdateProductByIdController,
} from '@/domains/product/interface/http';



export const makeHttpUpdateProductByIdController =
  (): HttpUpdateProductByIdController => {
    const getProductByIdRepository = new PrismaGetProductByIdRepository();
    const getProductByNameRepository = new PrismaGetProductByNameRepository();
    const updateProductByIdRepository = new PrismaUpdateProductRepository();

    const validation = makeUpdateProductValidation();


    return new HttpUpdateProductByIdController(
      getProductByIdRepository,
      getProductByNameRepository,
      updateProductByIdRepository,
      validation,

    );
  };
