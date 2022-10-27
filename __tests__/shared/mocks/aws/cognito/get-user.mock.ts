export const mockCognitoGetUser = jest
  .fn()
  .mockImplementation((params: any, callback: any) => {
    callback(null, null);
  });
