import { adaptRoute } from '@/shared/infra/express/adapters';

import { Router } from 'express';

import { authMiddleware } from '@/main/infra/express/middlewares';

import {
  makeHttpCreateClientController,
  makeHttpDeleteClientByIdController,
  makeHttpGetClientByIdController,
  makeHttpGetClientsByFilterController,
  makeHttpUpdateClientByIdController,
} from '@/domains/client/factories/http';

const clientRouter = Router();

clientRouter
  .route('/clients')
  .post(adaptRoute(makeHttpCreateClientController()))
  .get(
    authMiddleware('ADMIN'),
    adaptRoute(makeHttpGetClientsByFilterController())
  );

clientRouter
  .route('/clients/:id')
  .get(authMiddleware('USER'), adaptRoute(makeHttpGetClientByIdController()))
  .patch(
    authMiddleware('USER'),
    adaptRoute(makeHttpUpdateClientByIdController())
  )
  .delete(
    authMiddleware('ADMIN'),
    adaptRoute(makeHttpDeleteClientByIdController())
  );

export { clientRouter };
