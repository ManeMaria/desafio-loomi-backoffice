import {
  PrismaDeleteOrderItemsByIdRepository,
  PrismaGetOrderItemsByOrderIdRepository,
} from '@/domains/order/infra/prisma/repositories';
import {
  makeDeleteOrderItemsByOrderIdValidation,
} from '@/domains/order/interface/validation';
import {
  HttpDeleteOrderItemsByOrderIdController,
} from '@/domains/order/interface/http';



export const makeHttpDeleteOrderItemsByIdController =
  (): HttpDeleteOrderItemsByOrderIdController => {
    const getOrderItemsByIdRepository = new PrismaGetOrderItemsByOrderIdRepository();
    const deleteOrderItemsByIdRepository = new PrismaDeleteOrderItemsByIdRepository();
    const validation = makeDeleteOrderItemsByOrderIdValidation();

    return new HttpDeleteOrderItemsByOrderIdController(
      getOrderItemsByIdRepository,
      deleteOrderItemsByIdRepository,
      validation,
    );
  };
