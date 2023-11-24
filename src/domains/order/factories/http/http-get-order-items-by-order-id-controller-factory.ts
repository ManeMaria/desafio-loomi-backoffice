import {
  PrismaGetOrderItemsByOrderIdRepository,
} from '@/domains/order/infra/prisma/repositories';
import {
  makeGetOrderItemsByOrderIdValidation,
} from '@/domains/order/interface/validation';
import {
  HttpGetOrderItemsByOrderIdController
} from '@/domains/order/interface/http';



export const makeHttpGetOrderItemsByOrderIdController = (): HttpGetOrderItemsByOrderIdController => {
  const getOrderItemsByOrderIdRepository = new PrismaGetOrderItemsByOrderIdRepository();
  const validation = makeGetOrderItemsByOrderIdValidation();


  return new HttpGetOrderItemsByOrderIdController(
    getOrderItemsByOrderIdRepository,
    validation,
  );
};
