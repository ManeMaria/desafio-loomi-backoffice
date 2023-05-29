import 'module-alias/register';

import { env } from '@/main/config';
import { expressHttpServer } from '@/main/infra/express/express-http-client';
import { pinoLoggerLocal as loggerLocal } from '@/main/infra/logs/pino';
import { sentryLoggerCloud as loggerErrorCloud } from '@/main/infra/logs/sentry';
import { prismaConnector } from '@/main/infra/prisma/prisma-connector';
// import { socketInstance } from '@/main/infra/websocket';

const exitStatus = {
  Failure: 1,
  Success: 0,
};

process.on('unhandledRejection', (reason, promise) => {
  const error = new Error(
    `App exiting due to an unhandled promise: ${promise} and reason: ${reason}`
  );

  loggerLocal.logError(error);
  loggerErrorCloud.logError(error);

  throw reason;
});

process.on('uncaughtException', (error) => {
  loggerLocal.logError(error);
  loggerErrorCloud.logError(error);

  process.exit(exitStatus.Failure);
});

async function main() {
  try {
    prismaConnector.connect();
    loggerLocal.logInfo(
      `Prisma connect with success to ${env.databases.postgres.url}`
    );

    expressHttpServer.listen(env.httpServer.port, () =>
      loggerLocal.logInfo(
        `Server runing at http://localhost:${env.httpServer.port}`
      )
    );

    // socketInstance.create(expressHttpServer, {
    //   cors: {
    //     origin: '*'
    //   },
    // });

    const exitSignals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
    exitSignals.map((sig) =>
      process.on(sig, async () => {
        try {
          expressHttpServer.close();
          await prismaConnector.disconnect();

          loggerLocal.logInfo('App exit with success');
          process.exit(exitStatus.Success);
        } catch (error) {
          const errorWithType = error as Error;

          loggerLocal.logError(errorWithType);

          loggerErrorCloud.logError(errorWithType);

          process.exit(exitStatus.Failure);
        }
      })
    );
  } catch (error) {
    const errorWithType = error as Error;

    loggerLocal.logError(errorWithType);

    loggerErrorCloud.logError(errorWithType);

    process.exit(exitStatus.Failure);
  }
}

main();
