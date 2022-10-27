import http from 'http';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';

import { prismaConnector } from '@/shared/infra/prisma';
import { HttpStatus } from '@/shared/interface/http/helpers';

import { UserFactory } from '@/tests/domains/user/entities';

import { User } from '@/domains/user/entities';

import {
  mockCognitoAdminGetUser,
  mockCognitoGetUser,
} from '@/tests/shared/mocks/aws/cognito';
import { initAppE2E } from '@/tests/shared/utils';

jest.setTimeout(5000);

jest.mock('aws-sdk', () => {
  return {
    CognitoIdentityServiceProvider: class {
      getUser = mockCognitoGetUser;
    },
  };
});

describe('HttpUpdateUserByIdController (e2e)', () => {
  let app: http.Server;
  let prismaTest: PrismaClient;

  let user: User;

  beforeAll(async () => {
    prismaTest = prismaConnector.connect(process.env.DATABASE_TEST_URL);
    app = initAppE2E();

    await prismaTest.user.deleteMany({});
  });

  afterEach(async () => {
    if (prismaTest) {
      await prismaTest.user.deleteMany({});
    }
  });

  afterAll(async () => {
    if (prismaTest) {
      await prismaTest.$disconnect();
    }
  });

  describe('With valid parameters', () => {
    it('PATCH /users/:id', async () => {
      user = await prismaTest.user.create({
        data: UserFactory.build({
          enabled: true,
          isAdmin: false,
        }),
      });

      mockCognitoGetUser.mockImplementationOnce(
        (params: any, callback: any) => {
          callback(null, {
            UserAttributes: [
              {
                Name: 'email',
                Value: user.email,
              },
            ],
          });
        }
      );

      mockCognitoAdminGetUser.mockImplementationOnce(
        (params: any, callback: any) => {
          callback(null, {
            Username: user.email,
            UserStatus: 'any_status',
          });
        }
      );

      const res = await request(app)
        .patch(`/users/${user.id}`)
        .set('Authorization', 'Bearer any_token')
        .send({ name: 'any name' });

      expect(res.status).toBe(HttpStatus.OK);
    });
  });

  describe('With invalid parameters', () => {
    it('PATCH /users/:id - Should fail with invalid access token', async () => {
      mockCognitoGetUser.mockImplementationOnce(
        (params: any, callback: any) => {
          callback(new Error('any_error'), null);
        }
      );

      const user = UserFactory.build({ enabled: true });
      await prismaTest.user.create({ data: user });

      const updateCarParams = { name: 'New name' };

      const res = await request(app)
        .patch(`/users/${user.id}`)
        .send(updateCarParams)
        .set('Authorization', 'Bearer any_token');

      expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it('PATCH /users/:id - Should fail with invalid params', async () => {
      const user = UserFactory.build();
      await prismaTest.user.create({ data: user });

      mockCognitoGetUser.mockImplementationOnce(
        (params: any, callback: any) => {
          callback(null, {
            UserAttributes: [
              {
                Name: 'email',
                Value: user.email,
              },
            ],
          });
        }
      );

      const updateCarParams = { name: 123 };

      const res = await request(app)
        .patch(`/users/${user.id}`)
        .send(updateCarParams)
        .set('Authorization', 'Bearer any_token');

      expect(res.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });
});
