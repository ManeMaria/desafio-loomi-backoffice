export const mockCognitoAdminGetUser = jest
  .fn()
  .mockImplementation((params: any, callback: any) => {
    callback(null, null);
  });
