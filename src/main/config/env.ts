import 'dotenv/config';

export const env = {
  application: {
    mode: process.env.NODE_ENV as string,
  },
  cors: {
    production: {
      url: process.env.PRODUCTION_DEPLOY_URL as string,
      frontUrl: process.env.PRODUCTION_FRONT_DEPLOY_URL as string,
    },
    stage: {
      url: process.env.STAGE_DEPLOY_URL as string,
      frontUrl: process.env.STAGE_FRONT_DEPLOY_URL as string,
    },
  },
  httpServer: {
    port: parseInt(process.env.API_PORT as string, 10) || (3001 as number),
  },
  databases: {
    postgres: {
      url: process.env.DATABASE_URL,
    },
  },
  logs: {
    sentry: {
      url: process.env.SENTRY_URL as string,
    },
  },
  cloud: {
    cognito: {
      apiVersion: process.env.COGNITO_API_VERSION as string,
      region: process.env.COGNITO_REGION as string,
      clientId: process.env.COGNITO_CLIENT_ID as string,
      userPoolId: process.env.COGNITO_USER_POOL_ID as string,
    },
  },
  storage: {
    s3: {
      bucketName: process.env.AWS_BUCKET_NAME as string,
      region: process.env.AWS_BUCKET_REGION as string,
      accessKeyId: process.env.AWS_BUCKET_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.AWS_BUCKET_SECRET_ACCESS_KEY as string,
      folderAwsS3Bucket: process.env.AWS_S3_FOLDER as string,
    },
  },
  payment: {
    fakeStripe: {
      secretKey: process.env.STRIPE_SECRET_KEY as string,
      publicKey: process.env.STRIPE_PUBLIC_KEY as string,
    },
  }
};
