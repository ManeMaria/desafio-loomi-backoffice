import { Express, Router } from 'express';
import { authRouter } from '@/domains/auth/infra/express';
import { healthCheckRouter } from '@/main/infra/express/routes/health-check-routes';
import { userRouter } from '@/domains/user/infra/express';
import { errorMiddleware, responseMiddleware } from '../middlewares';
import { clientRouter } from '@/domains/client/infra/express';
import { productRouter } from '@/domains/product/infra/express';


export default (app: Express): void => {
  const router = Router();

  router.use(healthCheckRouter);
  router.use(authRouter);
  router.use(userRouter);
  router.use(clientRouter);
  router.use(productRouter)


  app.use(router);
  app.use(responseMiddleware);
  app.use(errorMiddleware);
};
