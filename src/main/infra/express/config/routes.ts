import { Express, Router } from 'express';
import { authRouter } from '@/domains/auth';
import { healthCheckRouter } from '@/main/infra/express/routes/health-check-routes';
import { userRouter } from '@/domains/user';
import { errorMiddleware, responseMiddleware } from '../middlewares';

export default (app: Express): void => {
  const router = Router();

  router.use(healthCheckRouter);
  router.use(authRouter);
  router.use(userRouter);

  app.use(router);
  app.use(responseMiddleware);
  app.use(errorMiddleware);
};
