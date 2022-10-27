import { IGetUserByEmailInCloudRepository } from '@/domains/user/usecases/repos';
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

          if (!data) {
            resolve(null);
          }

          const { Username: username, UserStatus: status }: any = data;

          const user = {
            status,
            email: username,
          };

          resolve(user);
        }
      );
    });
  }
}
