import { UserDTO } from '@/domains/user/user';

export interface IGetUserByEmailRepository {
  getByEmail(
    email: IGetUserByEmailRepository.Params
  ): Promise<IGetUserByEmailRepository.Result>;
}

export namespace IGetUserByEmailRepository {
  export type Params = string;
  export type Result = UserDTO | null;
}
