export const mockCognitoAdminCreateUser = jest
  .fn()
  .mockImplementation((params: any, callback: any) => {
    callback(null, null);
  });
