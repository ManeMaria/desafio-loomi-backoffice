import { adaptRoute } from '@/shared/infra/express/adapters';

import { Router } from 'express';

import { authMiddleware } from '@/main/infra/express/middlewares';

import {
  makeHttpCreateProductController,
  makeHttpDeleteProductByIdController,
  makeHttpGetProductByIdController,
  makeHttpGetProductsByFilterController,
  makeHttpUpdateProductByIdController,
} from '@/domains/product/factories/http';

const productRouter = Router();

productRouter
  .route('/products')
  .post(authMiddleware(['ADMIN']), adaptRoute(makeHttpCreateProductController()))
  .get(
    authMiddleware(['USER', 'ADMIN']),
    adaptRoute(makeHttpGetProductsByFilterController())
  );

productRouter
  .route('/products/:id')
  .get(authMiddleware(['USER', 'ADMIN']), adaptRoute(makeHttpGetProductByIdController()))
  .patch(
    authMiddleware(['ADMIN']),
    adaptRoute(makeHttpUpdateProductByIdController())
  )
  .delete(
    authMiddleware(['ADMIN']),
    adaptRoute(makeHttpDeleteProductByIdController())
  );

export { productRouter };
