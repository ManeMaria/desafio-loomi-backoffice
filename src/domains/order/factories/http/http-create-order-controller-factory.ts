import { CreateOrderItemsUsecase } from '@/domains/order/usecases';
import {
  PrismaSaveOrderItemsRepository,
  PrismaSaveOrderRepository,
} from '@/domains/order/infra/prisma/repositories';
import {
  PrismaGetProductByIdGateways,
  PrismaUpdateProductGateways
} from '@/domains/order/infra/prisma/gateways';
import {
  makeCreateOrderValidation,
  makeCreateOrderItemsValidation
} from '@/domains/order/interface/validation';
import {
  HttpCreateOrderController,
} from '@/domains/order/interface/http';


import { UUIDGeneratorAdapter } from '@/shared/infra/uuid';
import { StripePaymentIntentRepository } from '@/shared/infra/fake-stripe';



export const makeHttpCreateOrderController = (): HttpCreateOrderController => {
  const saveOrderRepository = new PrismaSaveOrderRepository();
  const saveOrderItemsRepository = new PrismaSaveOrderItemsRepository();

  const uuidGenerator = new UUIDGeneratorAdapter();

  const createOrderItemsUsecase = new CreateOrderItemsUsecase(saveOrderItemsRepository, uuidGenerator);

  const validation = makeCreateOrderValidation();
  const orderItemsvalidation = makeCreateOrderItemsValidation();

  const paymentIntentService = new StripePaymentIntentRepository();

  const PrismaGetProductByIdGetaways = new PrismaGetProductByIdGateways();
  const PrismaUpdateProductGetaways = new PrismaUpdateProductGateways();


  return new HttpCreateOrderController(
    saveOrderRepository,
    createOrderItemsUsecase,
    paymentIntentService,
    PrismaGetProductByIdGetaways,
    PrismaUpdateProductGetaways,
    uuidGenerator,
    validation,
    orderItemsvalidation
  );
};
