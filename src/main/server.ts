import 'module-alias/register';

import { env } from '@/main/config';
import { expressHttpServer } from '@/main/infra/express/express-http-client';
import { prismaConnector } from '@/main/infra/prisma/prisma-connector';

const exitStatus = {
  Failure: 1,
  Success: 0,
};

process.on('unhandledRejection', (reason, promise) => {
  const error = new Error(
    `App exiting due to an unhandled promise: ${promise} and reason: ${reason}`
  );

  console.log(error);

  throw reason;
});

process.on('uncaughtException', (error) => {
  console.log(error);

  process.exit(exitStatus.Failure);
});

async function main() {
  try {
    prismaConnector.connect();
    console.log(`Prisma connect with success to ${env.databases.postgres.url}`);

    expressHttpServer.listen(env.httpServer.port, () => {
      console.log('process.env.PORT', process.env.PORT)
      console.log(`Server runing at ${env.httpServer.port}`)
    });

    const exitSignals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
    exitSignals.map((sig) =>
      process.on(sig, async () => {
        try {

          expressHttpServer.close();

          await prismaConnector.disconnect();


          process.exit(exitStatus.Success);
        } catch (error) {
          const errorWithType = error as Error;

          console.log(errorWithType);

          console.log(errorWithType);

          process.exit(exitStatus.Failure);
        }
      })
    );
  } catch (error) {
    const errorWithType = error as Error;

    console.log(errorWithType);

    console.log(errorWithType);

    process.exit(exitStatus.Failure);
  }
}

main();
