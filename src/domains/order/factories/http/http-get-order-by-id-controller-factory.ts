import {
  PrismaGetOrderByIdRepository,
} from '@/domains/order/infra/prisma/repositories';
import {
  makeGetOrderByIdValidation,
} from '@/domains/order/interface/validation';
import {
  HttpGetOrderByIdController,
} from '@/domains/order/interface/http';



export const makeHttpGetOrderByIdController = (): HttpGetOrderByIdController => {
  const getOrderByIdRepository = new PrismaGetOrderByIdRepository();
  const validation = makeGetOrderByIdValidation();


  return new HttpGetOrderByIdController(
    getOrderByIdRepository,
    validation,

  );
};
