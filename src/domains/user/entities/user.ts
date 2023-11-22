
export enum UserTypeEnum {
  USER = 'USER',
  ADMIN = 'ADMIN',
}


export type UserType = {
  id: string;
  type: string;
  enabled?: boolean;
  name: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class User {
  id: string;
  type: string;
  enabled: boolean;
  name: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(user: UserType) {
    const { id, type, enabled, name, email, createdAt, updatedAt } = user;

    this.id = id;
    this.type = type;
    this.enabled = enabled ?? true;
    this.name = name;
    this.email = email;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;

    Object.freeze(this);
  }
}
