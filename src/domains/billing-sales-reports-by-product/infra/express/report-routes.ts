import { adaptRoute } from '@/shared/infra/express/adapters';

import { Router } from 'express';

import { authMiddleware } from '@/main/infra/express/middlewares';

import {
  makeHttpCreateController
} from '@/domains/billing-sales-reports-by-product/factories/http';

const reportRouter = Router();

reportRouter
  .route('/download-report')
  .post(
    authMiddleware(['ADMIN']),
    adaptRoute(makeHttpCreateController())
  ) // .get(
// authMiddleware(['ADMIN']),
// adaptRoute(makeHttpCreateController())

// );

export { reportRouter };
