import {
  DefaultException,
  ExceptionTypes,
} from '@/shared/helpers/error-helper';

import {
  Client,
} from '@/domains/client/entities';

export class ClientAlreadyExistsException extends DefaultException {
  constructor(client: Partial<Client>) {
    super({
      type: ExceptionTypes.USER,
      code: 'CLIENT_ALREADY_EXISTS',
      data: client,
    });
  }
}
