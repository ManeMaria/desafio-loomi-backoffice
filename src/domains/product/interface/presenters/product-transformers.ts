import { Product } from '@/domains/product/entities';
import {
  ProductDefaultPresenter,
} from '@/domains/product/interface/presenters';

export class ProductTransformers {
  static generateDefaultPresenter(product: Product): ProductDefaultPresenter {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      cost: product.cost,
      quantity: product.quantity,
      enabled: product.enabled,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,

      // association
      // inclusion_name: product.entityIncluded,
    };
  }
}
