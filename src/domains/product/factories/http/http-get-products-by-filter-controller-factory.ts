import {
  PrismaGetProductsByFilterRepository,
  PrismaCountProductsByFilterRepository,
} from '@/domains/product/infra/prisma/repositories';
import {
  makeGetProductsByFilterValidation,
} from '@/domains/product/interface/validation';
import {
  HttpGetProductsByFilterController,
} from '@/domains/product/interface/http';



export const makeHttpGetProductsByFilterController =
  (): HttpGetProductsByFilterController => {
    const getProductsByFilterRepository = new PrismaGetProductsByFilterRepository();
    const countProductsByFilterRepository = new PrismaCountProductsByFilterRepository();
    const validation = makeGetProductsByFilterValidation();


    return new HttpGetProductsByFilterController(
      getProductsByFilterRepository,
      countProductsByFilterRepository,
      validation,

    );
  };
