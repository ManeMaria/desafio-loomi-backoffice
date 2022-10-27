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
    authMiddleware('USER'),
    adaptRoute(makeHttpGetUsersByFilterController())
  );

userRouter
  .route('/users/:id')
  .get(authMiddleware('USER'), adaptRoute(makeHttpGetUserByIdController()))
  .patch(authMiddleware('USER'), adaptRoute(makeHttpUpdateUserByIdController()))
  .delete(
    authMiddleware('USER'),
    adaptRoute(makeHttpDeleteUserByIdController())
  );

export { userRouter };
