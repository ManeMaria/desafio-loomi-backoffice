import { IGetUserByEmailInCloudRepository } from '@/domains/user';
import aws, { CognitoIdentityServiceProvider } from 'aws-sdk';

import cognitoEnvironment from '@/shared/infra/cognito';

export class CognitoGetUserByEmailInCloudRepository
  implements IGetUserByEmailInCloudRepository
{
  private readonly cognitoInstance: CognitoIdentityServiceProvider;

  constructor() {
    this.cognitoInstance = new aws.CognitoIdentityServiceProvider({
      apiVersion: cognitoEnvironment.apiVersion,
      region: cognitoEnvironment.region,
      credentials: new aws.Credentials({
        accessKeyId: cognitoEnvironment.accessKeyId,
        secretAccessKey: cognitoEnvironment.secretAccessKey,
      }),
    });
  }

  async getByEmail(
    email: IGetUserByEmailInCloudRepository.Params
  ): Promise<IGetUserByEmailInCloudRepository.Result> {
    return new Promise((resolve, reject) => {
      this.cognitoInstance.adminGetUser(
        {
          Username: email,
          UserPoolId: cognitoEnvironment.userPoolId,
        },
        (err, data) => {
          if (err) {
            return resolve(null);
          }

          const { Username: username, UserStatus: status }: any = data;

          if (!data) {
            resolve(null);
          }

          const userDTO = {
            status: status,
            email: username,
          };

          resolve(userDTO);
        }
      );
    });
  }
}