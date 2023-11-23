import {
  PrismaGetOrderByIdRepository,
  PrismaUpdateOrderRepository,
} from '@/domains/order/infra/prisma/repositories';
import {
  makeUpdateOrderValidation,
} from '@/domains/order/interface/validation';
import {
  HttpUpdateOrderByIdController,
} from '@/domains/order/interface/http';



export const makeHttpUpdateOrderByIdController =
  (): HttpUpdateOrderByIdController => {
    const getOrderByIdRepository = new PrismaGetOrderByIdRepository();
    const updateOrderByIdRepository = new PrismaUpdateOrderRepository();

    const validation = makeUpdateOrderValidation();


    return new HttpUpdateOrderByIdController(
      getOrderByIdRepository,
      updateOrderByIdRepository,
      validation,

    );
  };
