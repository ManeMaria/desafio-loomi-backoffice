import {
  DefaultException,
  ExceptionTypes,
} from '@/shared/helpers/error-helper';


import {
  Client,
} from '@/domains/client/entities';

export class ClientNotFoundException extends DefaultException {
  constructor(client: Partial<Client>) {
    super({
      type: ExceptionTypes.USER,
      code: 'CLIENT_NOT_FOUND',
      data: client,
    });
  }
}
