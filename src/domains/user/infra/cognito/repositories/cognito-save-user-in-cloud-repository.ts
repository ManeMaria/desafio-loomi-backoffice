import { ISaveUserInCloudRepository } from '@/domains/user/usecases/repos';
import aws, { CognitoIdentityServiceProvider } from 'aws-sdk';

import cognitoEnvironment, { CognitoException } from '@/shared/infra/cognito';

export class CognitoSaveUserInCloudRepository
  implements ISaveUserInCloudRepository {
  private readonly cognitoInstance: CognitoIdentityServiceProvider;

  constructor() {
    this.cognitoInstance = new aws.CognitoIdentityServiceProvider({
      apiVersion: cognitoEnvironment.apiVersion,
      region: cognitoEnvironment.region,
    });
  }

  async save(
    userParams: ISaveUserInCloudRepository.Params
  ): Promise<ISaveUserInCloudRepository.Result> {
    const { email, name } = userParams;

    const attributes = [

      {
        Name: 'email',
        Value: email,
      },
      {
        Name: 'email_verified',
        Value: 'True',
      },
    ];

    return new Promise<ISaveUserInCloudRepository.Result>((resolve, reject) => {
      this.cognitoInstance.adminCreateUser(
        {
          Username: name,
          UserAttributes: attributes,
          UserPoolId: cognitoEnvironment.userPoolId,
          DesiredDeliveryMediums: ['EMAIL'],
          // MessageAction: 'SUPPRESS',
        },
        (err, data) => {
          if (err) {
            return reject(new CognitoException(err));
          }

          resolve();
        }
      );
    });
  }
}
