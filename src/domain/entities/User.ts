import { UserError } from '@/domain/errors';

type UserInput = {
  id: string;
  isAdmin: boolean;
  name: string;
  email: string;
  enabled?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

type UserToJSON = {
  id: string;
  isAdmin: boolean;
  name: string;
  email: string;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type UpdateUserInput = {
  isAdmin?: boolean;
  name?: string;
  email?: string;
  enabled?: boolean;
};

class User {
  private readonly id: string;
  private isAdmin: boolean;
  private enabled: boolean;
  private name: string;
  private email: string;
  private readonly createdAt: Date;
  private updatedAt: Date;

  constructor(createUserParams: UserInput) {
    const { id, isAdmin, name, email, enabled, createdAt, updatedAt } =
      createUserParams;

    if (id === null || id === undefined) {
      throw new UserError('ID is not passed');
    }

    if (isAdmin === null || isAdmin === undefined) {
      throw new UserError('isAdmin is not passed');
    }

    if (name === null || name === undefined) {
      throw new UserError('Email is not passed');
    }

    this.id = id;
    this.isAdmin = isAdmin;
    this.name = name;
    this.email = email;
    this.enabled = enabled || true;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  toJSON(): UserToJSON {
    return {
      id: this.id,
      isAdmin: this.isAdmin,
      enabled: this.enabled,
      name: this.name,
      email: this.email,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  updateUserTime() {
    this.updatedAt = new Date();
  }

  updateIsAdmin(isAdmin: boolean) {
    this.isAdmin = isAdmin;
    this.updateUserTime();
  }

  updateEnabled(enabled: boolean) {
    this.enabled = enabled;
    this.updateUserTime();
  }

  updateEmail(email: string) {
    this.email = email;
    this.updateUserTime();
  }

  updateName(name: string) {
    this.name = name;
    this.updateUserTime();
  }

  updateParams(paramsToUpdate: UpdateUserInput): User {
    const entriesOfParamsToUpdate = Object.entries(paramsToUpdate);

    const filteredEntriesToUpdateUser = entriesOfParamsToUpdate.filter(
      ([key, value]) => value !== undefined && value !== null
    );

    for (const [property, value] of filteredEntriesToUpdateUser) {
      if (property === 'isAdmin') {
        // @ts-ignore
        this.updateIsAdmin(value);
      }

      if (property === 'name') {
        // @ts-ignore
        this.updateName(value);
      }

      if (property === 'email') {
        // @ts-ignore
        this.updateEmail(value);
      }

      if (property === 'enabled') {
        // @ts-ignore
        this.updateEnabled(value);
      }
    }

    return this;
  }

  getId(): string {
    return this.id;
  }
}

export { User, UserInput, UserToJSON };
