import { adaptRoute } from '@/shared/infra/express/adapters';

import { Router } from 'express';

import { authMiddleware } from '@/main/infra/express/middlewares';

import {
  makeHttpCreateOrderController,
  makeHttpDeleteOrderByIdController,
  makeHttpGetOrderByIdController,
  makeHttpGetOrdersByFilterController,
  makeHttpUpdateOrderByIdController,
  makeHttpDeleteOrderItemsByIdController,
  makeHttpGetOrderItemsByOrderIdController
} from '@/domains/order/factories/http';

const orderRouter = Router();

// TODO: falta rotas do orderItem

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

orderRouter.route('/order-item/:id')
  .get(authMiddleware(['ADMIN', 'USER']), adaptRoute(makeHttpGetOrderItemsByOrderIdController()))
  .delete(
    authMiddleware(['ADMIN']),
    adaptRoute(makeHttpDeleteOrderItemsByIdController())
  );

export { orderRouter };
