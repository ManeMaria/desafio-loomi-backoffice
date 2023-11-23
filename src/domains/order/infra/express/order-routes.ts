import { adaptRoute } from '@/shared/infra/express/adapters';

import { Router } from 'express';

import { authMiddleware } from '@/main/infra/express/middlewares';

import {
  makeHttpCreateOrderController,
  makeHttpDeleteOrderByIdController,
  makeHttpGetOrderByIdController,
  makeHttpGetOrdersByFilterController,
  makeHttpUpdateOrderByIdController,
} from '@/domains/order/factories/http';

const orderRouter = Router();

orderRouter
  .route('/orders')
  .post(authMiddleware(['USER', 'ADMIN']), adaptRoute(makeHttpCreateOrderController()))
  .get(
    authMiddleware(['ADMIN']),
    adaptRoute(makeHttpGetOrdersByFilterController())
  );

orderRouter
  .route('/orders/:id')
  .get(authMiddleware(['USER', 'ADMIN']), adaptRoute(makeHttpGetOrderByIdController()))
  .patch(
    authMiddleware(['ADMIN']),
    adaptRoute(makeHttpUpdateOrderByIdController())
  )
  .delete(
    authMiddleware(['ADMIN']),
    adaptRoute(makeHttpDeleteOrderByIdController())
  );

export { orderRouter };
