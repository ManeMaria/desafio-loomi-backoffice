import {
  PrismaDeleteProductByIdRepository,
  PrismaGetProductByIdRepository,
} from '@/domains/product/infra/prisma/repositories';
import {
  makeDeleteProductByIdValidation,
} from '@/domains/product/interface/validation';
import {
  HttpDeleteProductByIdController,
} from '@/domains/product/interface/http';



export const makeHttpDeleteProductByIdController =
  (): HttpDeleteProductByIdController => {
    const getProductByIdRepository = new PrismaGetProductByIdRepository();
    const deleteProductByIdRepository = new PrismaDeleteProductByIdRepository();

    const validation = makeDeleteProductByIdValidation();


    return new HttpDeleteProductByIdController(
      getProductByIdRepository,
      deleteProductByIdRepository,
      validation,

    );
  };
