import http from 'http';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';

import { prismaConnector } from '@/shared/infra/prisma';
import { HttpStatus } from '@/shared/interface/http/helpers';

import { UserFactory } from '@/tests/domains/user/entities';

import { User } from '@/domains/user/entities';

import {
  mockCognitoGetUser,
  mockCognitoAdminGetUser,
} from '@/tests/shared/mocks/aws/cognito';
import { initAppE2E } from '@/tests/shared/utils';

jest.setTimeout(5000);

jest.mock('aws-sdk', () => {
  return {
    CognitoIdentityServiceProvider: class {
      getUser = mockCognitoGetUser;
      adminGetUser = mockCognitoAdminGetUser;
    },
  };
});

describe('HttpGetUserByIdController (e2e)', () => {
  let app: http.Server;
  let prismaTest: PrismaClient;

  let authUser: User;

  beforeAll(async () => {
    prismaTest = prismaConnector.connect(process.env.DATABASE_TEST_URL);
    app = initAppE2E();

    await prismaTest.user.deleteMany({});

    authUser = await prismaTest.user.create({
      data: UserFactory.build({
        enabled: true,
      }),
    });

    mockCognitoGetUser.mockImplementation((params: any, callback: any) => {
      callback(null, {
        UserAttributes: [
          {
            Name: 'email',
            Value: authUser.email,
          },
        ],
      });
    });
  });

  afterAll(async () => {
    if (prismaTest) {
      await prismaTest.user.deleteMany({});
      await prismaTest.$disconnect();
    }
  });

  describe('With valid parameters', () => {
    it('GET /users/:id', async () => {
      mockCognitoAdminGetUser.mockImplementationOnce(
        (params: any, callback: any) => {
          callback(null, {
            Username: authUser.email,
            UserStatus: 'any_status',
          });
        }
      );

      const res = await request(app)
        .get(`/users/${authUser.id}`)
        .set('Authorization', 'Bearer any_token');

      expect(res.status).toBe(HttpStatus.OK);
      expect(res.body.id).toBe(authUser.id);
      expect(res.body.name).toBe(authUser.name);
      expect(res.body.email).toBe(authUser.email);
      expect(res.body.is_admin).toBe(authUser.isAdmin);
    });
  });

  describe('With invalid parameters', () => {
    it('GET /users/:id - Should fail with invalid access token', async () => {
      mockCognitoGetUser.mockImplementationOnce(
        (params: any, callback: any) => {
          callback(new Error('any_error'), null);
        }
      );

      const user = UserFactory.build();
      await prismaTest.user.create({ data: user });

      const res = await request(app)
        .get(`/users/${user.id}`)
        .set('Authorization', 'token');

      expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it('GET /users/:id - Should fail with not found id', async () => {
      const user = UserFactory.build({ enabled: true });

      const res = await request(app)
        .get(`/users/${user.id}`)
        .set('Authorization', 'Bearer any_token');

      expect(res.status).toBe(HttpStatus.NOT_FOUND);
    });

    it('GET /users/:id - Should fail with invalid id', async () => {
      const res = await request(app)
        .get('/users/invalid_id')
        .set('Authorization', 'Bearer any_token');

      expect(res.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });
});
