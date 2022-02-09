import { Express } from 'express';

import {
  bodyParser,
  corsMiddleware,
  contentType,
  helmetMiddleware,
  pinoHttp,
  responseMiddleware,
  errorMiddleware,
} from '@/main/infra/express/middlewares';

export default (app: Express): void => {
  app.use(helmetMiddleware);
  app.use(bodyParser);
  app.use(corsMiddleware);
  app.use(contentType);
  app.use(pinoHttp);
  app.use(responseMiddleware);
  app.use(errorMiddleware);
};
