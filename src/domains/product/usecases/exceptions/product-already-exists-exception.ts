import {
  DefaultException,
  ExceptionTypes,
} from '@/shared/helpers/error-helper';

import {
  Product,
} from '@/domains/product/entities';

export class ProductAlreadyExistsException extends DefaultException {
  constructor(product: Partial<Product>) {
    super({
      type: ExceptionTypes.PRODUCT,
      code: 'PRODUCT_ALREADY_EXISTS',
      data: product,
    });
  }
}
