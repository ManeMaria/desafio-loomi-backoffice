import {
  PrismaSaveOrderRepository,
} from '@/domains/order/infra/prisma/repositories';
import {
  makeCreateOrderValidation,
} from '@/domains/order/interface/validation';
import {
  HttpCreateOrderController,
} from '@/domains/order/interface/http';


import { UUIDGeneratorAdapter } from '@/shared/infra/uuid';

export const makeHttpCreateOrderController = (): HttpCreateOrderController => {
  const saveOrderRepository = new PrismaSaveOrderRepository();
  const uuidGenerator = new UUIDGeneratorAdapter();
  const validation = makeCreateOrderValidation();


  return new HttpCreateOrderController(
    saveOrderRepository,
    uuidGenerator,
    validation,

  );
};
