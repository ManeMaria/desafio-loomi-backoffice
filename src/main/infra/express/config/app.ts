import express from 'express';

import setupMiddlewares from './middlewares';
import setupRoutes from './routes';

import { env } from '@/main/config';

const app = express();

(async () => {
  if (
    env.application.mode !== 'production' &&
    env.application.mode !== 'test'
  ) {
    await (async () => {
      (await import('./swagger.js')).default(app);
    })();
  }

  setupMiddlewares(app);
  setupRoutes(app);
})();

export default app;
