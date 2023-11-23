import {
  PrismaDeleteOrderByIdRepository,
  PrismaGetOrderByIdRepository,
} from '@/domains/order/infra/prisma/repositories';
import {
  makeDeleteOrderByIdValidation,
} from '@/domains/order/interface/validation';
import {
  HttpDeleteOrderByIdController,
} from '@/domains/order/interface/http';



export const makeHttpDeleteOrderByIdController =
  (): HttpDeleteOrderByIdController => {
    const getOrderByIdRepository = new PrismaGetOrderByIdRepository();
    const deleteOrderByIdRepository = new PrismaDeleteOrderByIdRepository();

    const validation = makeDeleteOrderByIdValidation();


    return new HttpDeleteOrderByIdController(
      getOrderByIdRepository,
      deleteOrderByIdRepository,
      validation,

    );
  };
