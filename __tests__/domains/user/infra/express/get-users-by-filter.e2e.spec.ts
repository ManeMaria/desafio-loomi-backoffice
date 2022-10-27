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

describe('HttpGetUsersByFilterController (e2e)', () => {
  let app: http.Server;
  let prismaTest: PrismaClient;

  let authUser: User;
  let users: User[];

  beforeAll(async () => {
    prismaTest = prismaConnector.connect(process.env.DATABASE_TEST_URL);
    app = initAppE2E();

    await prismaTest.user.deleteMany({});

    authUser = await prismaTest.user.create({
      data: UserFactory.build({
        enabled: true,
        isAdmin: true,
      }),
    });

    await prismaTest.user.createMany({
      data: UserFactory.buildList(10, {
        enabled: true,
        isAdmin: false,
      }),
    });

    users = await prismaTest.user.findMany({
      where: {
        NOT: {
          id: authUser.id,
        },
      },
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
    it('GET /users', async () => {
      const res = await request(app)
        .get('/users?is_admin=false')
        .set('Authorization', 'Bearer any_token');

      expect(res.status).toBe(HttpStatus.OK);
      expect(res.body.items.length).toBe(users.length);
    });

    it('GET /users - Should paginate users', async () => {
      const paginationCases = [
        { take: 5, skip: 5, totalItemsListed: 5 },
        { take: 1, skip: 10, totalItemsListed: 0 },
        { take: 0, skip: 10, totalItemsListed: 0 },
        { take: 10, skip: 0, totalItemsListed: 10 },
        { take: 10, skip: 8, totalItemsListed: 2 },
      ];

      for (const paginationCase of paginationCases) {
        const res = await request(app)
          .get(
            `/users?take=${paginationCase.take}&skip=${paginationCase.skip}&is_admin=false`
          )
          .set('Authorization', 'Bearer any_token');

        expect(res.status).toBe(HttpStatus.OK);
        expect(res.body.totalItems).toBe(users.length);
        expect(res.body.totalItemsListed).toBe(paginationCase.totalItemsListed);
      }
    });
  });

  describe('With invalid parameters', () => {
    it('GET /users/:id - Should fail with invalid filters', async () => {
      const res = await request(app)
        .get('/users?name=123')
        .set('Authorization', 'Bearer any_token');

      expect(res.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });
});
