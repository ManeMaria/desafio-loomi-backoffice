export enum TypeAuthUserEnum {
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN',
}

export type AuthUserType = {
  id: string;
  type: string;
  email: string;
  name: string;
};

export class AuthUser {
  id: string;
  type: string;
  email: string;
  name: string;

  constructor(params: AuthUserType) {
    const { id, type, email, name } = params;

    this.id = id;
    this.type = type;
    this.email = email;
    this.name = name;
  }
}
