export const mockCognitoAdminDeleteUser = jest
  .fn()
  .mockImplementation((params: any, callback: any) => {
    callback(null, null);
  });
