import { Express } from 'express';

import {
  bodyParser,
  corsMiddleware,
  contentType,
  helmetMiddleware,
  limiter,
} from '@/main/infra/express/middlewares';

export default (app: Express): void => {
  app.use(helmetMiddleware);
  app.use(bodyParser);
  app.use(corsMiddleware);
  app.use(contentType);
  app.use(limiter);
};
