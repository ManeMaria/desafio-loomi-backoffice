import {
  SwaggerContents,
  SwaggerSchemas,
  SwaggerTypes,
  SwaggerResponse,
  defaultResponses,
  SwaggerQuery,
} from '@/shared/infra/swagger/helpers';
import { TypeAuthUserEnum } from '@/domains/auth/entities/auth-user';

export const authTag = 'Auth';

export const authUserSchema = SwaggerSchemas.create('AuthUser', [
  ['id', SwaggerTypes.uuid(true)],
  ['name', SwaggerTypes.string(true)],
  ['email', SwaggerTypes.email(true)],
  ['type', SwaggerTypes.enum(true, Object.values(TypeAuthUserEnum))],
]);

export const authPaths = {
  '/auth/first-access': {
    post: {
      tags: [authTag],
      summary: 'First login',
      produces: ['application/json'],
      requestBody: {
        content: SwaggerContents.applicationJson([
          ['email', SwaggerTypes.email(true)],
          ['new_password', SwaggerTypes.password(true)],
          ['temporary_password', SwaggerTypes.password(true)],
        ]),
      },
      responses: {
        ...SwaggerResponse.ok(
          'Successfully Made First Login',
          SwaggerContents.applicationJson([
            [
              'access_token',
              SwaggerTypes.string(true, 'eyJraWQiOiJoenp3SHBiMEdZZmJOTE9HN0J'),
            ],
            [
              'refresh_token',
              SwaggerTypes.string(true, 'eyJraWQiOiJoenp3SHBiMEdZZmJOTE9HN0J'),
            ],
            [
              'authUser',
              SwaggerTypes.object(true, [
                ['id', SwaggerTypes.uuid(true)],
                ['name', SwaggerTypes.string(true)],
                ['email', SwaggerTypes.email(true)],
                ['type', SwaggerTypes.enum(true, Object.values(TypeAuthUserEnum))],
              ]),
            ],
          ])
        ),
        ...defaultResponses,
      },
    },
  },
  '/auth/login': {
    post: {
      tags: [authTag],
      summary: 'Login',
      produces: ['application/json'],
      parameters: [
        ...SwaggerQuery.params([
          ['email', SwaggerTypes.email(true, 'cesar@loomi.com.br')],
          ['password', SwaggerTypes.password(true)],
        ]),

      ],
      // requestBody: {
      //   content: SwaggerContents.applicationJson([
      //     ['email', SwaggerTypes.email(true)],
      //     ['password', SwaggerTypes.password(true)],
      //   ]),


      responses: {
        ...SwaggerResponse.ok(
          'Succesfully Logged',
          SwaggerContents.applicationJson([
            [
              'access_token',
              SwaggerTypes.string(true, 'eyJraWQiOiJoenp3SHBiMEdZZmJOTE9HN0J'),
            ],
            [
              'refresh_token',
              SwaggerTypes.string(true, 'eyJraWQiOiJoenp3SHBiMEdZZmJOTE9HN0J'),
            ],
            [
              'authUser',
              SwaggerTypes.object(true, [
                ['id', SwaggerTypes.uuid(true)],
                ['name', SwaggerTypes.string(true)],
                ['email', SwaggerTypes.email(true)],
                ['type', SwaggerTypes.enum(true, Object.values(TypeAuthUserEnum))],
              ]),
            ],
          ])
        ),
        ...defaultResponses,
      },
    },
  },
  '/auth/forgot-password': {
    post: {
      tags: ['Auth'],
      summary: 'Forgot Password',
      produces: ['application/json'],
      requestBody: {
        content: SwaggerContents.applicationJson([
          ['email', SwaggerTypes.email(true)],
        ]),
      },
      responses: {
        ...SwaggerResponse.ok('Successfully forgot password'),
        ...defaultResponses,
      },
    },
  },
  '/auth/confirm-forgot-password': {
    post: {
      tags: ['Auth'],
      summary: 'Confirm Forgot Password',
      produces: ['application/json'],
      requestBody: {
        content: SwaggerContents.applicationJson([
          ['email', SwaggerTypes.email(true)],
          ['new_password', SwaggerTypes.password(true)],
          ['verification_code', SwaggerTypes.password(true)],
        ]),
      },
      responses: {
        ...SwaggerResponse.ok('Successfully confirm forgot password'),
        ...defaultResponses,
      },
    },
  },
  '/auth/refresh-token': {
    post: {
      tags: ['Auth'],
      summary: 'Get a refresh token',
      produces: ['application/json'],
      requestBody: {
        content: SwaggerContents.applicationJson([
          [
            'refresh_token',
            SwaggerTypes.string(true, 'eyJraWQiOiJoenp3SHBiMEdZZmJOTE9HN0J'),
          ],
        ]),
      },
      responses: {
        ...SwaggerResponse.ok(
          'Successfully refresh a token',
          SwaggerContents.applicationJson([
            [
              'access_token',
              SwaggerTypes.string(true, 'eyJraWQiOiJoenp3SHBiMEdZZmJOTE9HN0J'),
            ],
          ])
        ),
        ...defaultResponses,
      },
    },
  },
};
