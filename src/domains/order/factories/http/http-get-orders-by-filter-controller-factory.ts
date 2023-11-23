import {
  PrismaGetOrdersByFilterRepository,
  PrismaCountOrdersByFilterRepository,
} from '@/domains/order/infra/prisma/repositories';
import {
  makeGetOrdersByFilterValidation,
} from '@/domains/order/interface/validation';
import {
  HttpGetOrdersByFilterController,
} from '@/domains/order/interface/http';



export const makeHttpGetOrdersByFilterController =
  (): HttpGetOrdersByFilterController => {
    const getOrdersByFilterRepository = new PrismaGetOrdersByFilterRepository();
    const countOrdersByFilterRepository = new PrismaCountOrdersByFilterRepository();
    const validation = makeGetOrdersByFilterValidation();


    return new HttpGetOrdersByFilterController(
      getOrdersByFilterRepository,
      countOrdersByFilterRepository,
      validation,

    );
  };
