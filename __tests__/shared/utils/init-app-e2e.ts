import http from 'http';

import { expressHttpServer } from '@/main/infra/express/express-http-client';

export const initAppE2E = (): http.Server => {
  return expressHttpServer;
};
