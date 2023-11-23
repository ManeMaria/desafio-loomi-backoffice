import {
  DefaultException,
  ExceptionTypes,
} from '@/shared/helpers/error-helper';


import {
  Product,
} from '@/domains/product/entities';

export class ProductNotFoundException extends DefaultException {
  constructor(product: Partial<Product>) {
    super({
      type: ExceptionTypes.USER,
      code: 'PRODUCT_NOT_FOUND',
      data: product,
    });
  }
}
