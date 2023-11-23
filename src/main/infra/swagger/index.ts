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
import { clientSchema, clientPaths } from '@/domains/client/infra/swagger'
import { productSchema, productPaths } from '@/domains/product/infra/swagger';
import { orderSchema, orderPaths } from '@/domains/order/infra/swagger';



const tags = [authTag, userTag];
// TODO: usar o file do node para criar esse arquivo
const schemas = {
  ...errorSchema,
  ...authUserSchema,
  ...userSchema,
  ...clientSchema,
  ...productSchema,
  ...orderSchema
};

export default {
  openapi: '3.0.0',
  info: {
    title: 'Node Leap API',
    version: '0.0.0',
    description: 'API',
    contact: {
      email: 'cesar@loomi.com.br',
    },
  },
  servers,
  tags,
  paths: {
    ...authPaths,
    ...userPaths,
    ...clientPaths,
    ...productPaths,
    ...orderPaths
  },
  components: {
    securitySchemes,
    schemas,
  },
};
