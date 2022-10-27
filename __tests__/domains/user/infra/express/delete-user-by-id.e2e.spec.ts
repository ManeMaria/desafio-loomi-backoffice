import http from 'http';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';

import { prismaConnector } from '@/shared/infra/prisma';
import { HttpStatus } from '@/shared/interface/http/helpers';

import { UserFactory } from '@/tests/domains/user/entities';

import { User } from '@/domains/user/entities';

import {
  mockCognitoAdminGetUser,
  mockCognitoAdminDeleteUser,
  mockCognitoGetUser,
} from '@/tests/shared/mocks/aws/cognito';
import { initAppE2E } from '@/tests/shared/utils';

jest.setTimeout(5000);

jest.mock('aws-sdk', () => {
  return {
    CognitoIdentityServiceProvider: class {
      getUser = mockCognitoGetUser;
      adminGetUser = mockCognitoAdminGetUser;
      adminDeleteUser = mockCognitoAdminDeleteUser;
    },
  };
});

describe('HttpDeleteUserByIdController (e2e)', () => {
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
    it('DELETE /users/:id', async () => {
      user = await prismaTest.user.create({
        data: UserFactory.build({
          enabled: true,
        }),
      });

      mockCognitoGetUser.mockImplementation((params: any, callback: any) => {
        callback(null, {
          UserAttributes: [
            {
              Name: 'email',
              Value: user.email,
            },
          ],
        });
      });

      mockCognitoAdminGetUser.mockImplementationOnce(
        (params: any, callback: any) => {
          callback(null, {
            Username: user.email,
            UserStatus: 'any_status',
          });
        }
      );

      const res = await request(app)
        .delete(`/users/${user.id}`)
        .set('Authorization', 'Bearer any_token');

      expect(res.status).toBe(HttpStatus.NO_CONTENT);
    });
  });

  describe('With invalid parameters', () => {
    it('DELETE /users/:id - Should fail with invalid id', async () => {
      user = await prismaTest.user.create({
        data: UserFactory.build({
          enabled: true,
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

      const res = await request(app)
        .delete('/users/invalid_id')
        .set('Authorization', 'Bearer any_token');

      expect(res.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it('DELETE /users/:id - Should fail with not found id', async () => {
      user = await prismaTest.user.create({
        data: UserFactory.build({
          enabled: true,
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

      const res = await request(app)
        .delete(`/users/${user.id}`)
        .set('Authorization', 'Bearer any_token');

      expect(res.status).toBe(HttpStatus.NOT_FOUND);
    });

    it('DELETE /users/:id - Should fail with invalid id', async () => {
      user = await prismaTest.user.create({
        data: UserFactory.build({
          enabled: true,
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

      const res = await request(app)
        .delete('/users/id')
        .set('Authorization', 'Bearer any_token');

      expect(res.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });
});
