import http from 'http';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';

import { prismaConnector } from '@/shared/infra/prisma';
import { HttpStatus } from '@/shared/interface/http/helpers';

import { UserFactory } from '@/tests/domains/user/entities';

import {
  mockCognitoAdminCreateUser,
  mockCognitoAdminGetUser,
} from '@/tests/shared/mocks/aws/cognito';
import { initAppE2E, keysToSnakeCasePattern } from '@/tests/shared/utils';

jest.setTimeout(5000);

jest.mock('aws-sdk', () => {
  return {
    CognitoIdentityServiceProvider: class {
      adminGetUser = mockCognitoAdminGetUser;
      adminCreateUser = mockCognitoAdminCreateUser;
    },
  };
});

describe('HttpCreateUserController (e2e)', () => {
  let app: http.Server;
  let prismaTest: PrismaClient;

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
    it('POST /users', async () => {
      const user = keysToSnakeCasePattern(
        UserFactory.build({
          enabled: true,
        })
      );

      const res = await request(app).post('/users').send(user);

      expect(res.status).toBe(HttpStatus.CREATED);
      expect(res.body.id).toBeDefined();
      expect(res.body.name).toBe(user.name);
      expect(res.body.email).toBe(user.email);
      expect(res.body.is_admin).toBe(user.is_admin);
    });
  });

  describe('With invalid parameters', () => {
    it('POST /users - Should fail with invalid params', async () => {
      const res = await request(app).post('/users').send({ name: 'any_name' });

      expect(res.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });
});
