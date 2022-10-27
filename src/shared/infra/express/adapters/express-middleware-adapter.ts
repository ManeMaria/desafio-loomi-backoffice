import { Middleware } from '@/shared/interface/http/protocols';

import { NextFunction, Request, Response } from 'express';

export const adaptMiddleware = (middleware: Middleware): any => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const request = {
      access_token: req.headers?.authorization,
    };

    const httpResponse = await middleware.handle(request);

    if (httpResponse.statusCode === 200) {
      Object.assign(req, httpResponse.body);
      next();
    } else {
      next(httpResponse);
    }
  };
};
