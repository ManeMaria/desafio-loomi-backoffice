import { adaptRoute } from '@/shared/infra/express/adapters';

import { Router } from 'express';

import { authMiddleware } from '@/main/infra/express/middlewares';

import {
  makeHttpCreateUserController,
  makeHttpDeleteUserByIdController,
  makeHttpGetUserByIdController,
  makeHttpGetUsersByFilterController,
  makeHttpUpdateUserByIdController,
} from '@/domains/user/factories/http';

const userRouter = Router();

userRouter
  .route('/users')
  .post(adaptRoute(makeHttpCreateUserController()))
  .get(
    authMiddleware('ADMIN'),
    adaptRoute(makeHttpGetUsersByFilterController())
  );

userRouter
  .route('/users/:id')
  .get(authMiddleware('CLIENT'), adaptRoute(makeHttpGetUserByIdController()))
  .patch(authMiddleware('CLIENT'), adaptRoute(makeHttpUpdateUserByIdController()))
  .delete(
    authMiddleware('CLIENT'),
    adaptRoute(makeHttpDeleteUserByIdController())
  );

export { userRouter };
