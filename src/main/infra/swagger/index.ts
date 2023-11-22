import {
  servers,
  securitySchemes,
  errorSchema,
} from '@/shared/infra/swagger/helpers';

import {
  authPaths,
  authTag,
  authUserSchema,
} from '@/domains/auth/infra/swagger';
import { userPaths, userTag, userSchema } from '@/domains/user/infra/swagger';
import { clientSchema, clientPaths } from '@/domains/client/infra/swagger';

const tags = [authTag, userTag];

const schemas = {
  ...errorSchema,
  ...authUserSchema,
  ...userSchema,
  ...clientSchema
};

export default {
  openapi: '3.0.0',
  info: {
    title: 'Node Leap API',
    version: '0.0.0',
    description: 'API',
    contact: {
      email: 'tech@loomi.com.br',
    },
  },
  servers,
  tags,
  paths: {
    ...authPaths,
    ...userPaths,
    ...clientPaths,
  },
  components: {
    securitySchemes,
    schemas,
  },
};
