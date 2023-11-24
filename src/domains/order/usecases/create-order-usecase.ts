import {
  Order,
  OrderItems
} from '@/domains/order/entities';
import {
  ISaveOrderRepository,
} from '@/domains/order/usecases/repos';
import {
  PrismaGetProductByIdGateways,
  PrismaUpdateProductGateways
} from '@/domains/order/infra/prisma/gateways';

import { ICreateOrderItemsUsecase } from '@/domains/order/usecases';
import { IUuidGenerator } from '@/shared/protocols';
import { IStripePaymentIntentClass } from '@/main/infra/fake-stripe';
import { OrderItemInsufficientStockException } from './exceptions';

export interface ICreateOrderUsecase {
  execute(
    params: ICreateOrderUsecase.Params,
  ): Promise<ICreateOrderUsecase.Response>;
}

export namespace ICreateOrderUsecase {
  export type Params = {
    clientId: string;
    status: string;
    totalOrder: number;
    orderItems: {
      quantity: number;
      costPerItem: number;
      productId: string;
    }[];
  }

  export type Response = Order & {
    orderItems: OrderItems[];
  };
}


// TODO: calculo de quantidade do estoque

export class CreateOrderUsecase implements ICreateOrderUsecase {

  constructor(
    private readonly saveOrderRepository: ISaveOrderRepository,
    private readonly createOrderItemsUsecase: ICreateOrderItemsUsecase,
    private readonly paymentIntentService: IStripePaymentIntentClass,
    private readonly prismaGetProductByIdGetaways: PrismaGetProductByIdGateways,
    private readonly prismaUpdateProductGetaways: PrismaUpdateProductGateways,
    private readonly uuidGenerator: IUuidGenerator,

  ) {

  }

  async execute(
    params: ICreateOrderUsecase.Params,
  ): Promise<ICreateOrderUsecase.Response> {
    console.log({ message: 'Request received', data: params });

    const {
      clientId,
      status,
      orderItems,
    } = params;


    const totalOrder = this.amountOrderItems(orderItems);

    await this.paymentIntentService.confirm({
      amount: totalOrder,
      currency: 'brl',
      receipt_email: 'any',
      customer: clientId,
      installments: 1,
    });


    const id = this.uuidGenerator.generate();

    const order = new Order({
      id,
      clientId,
      status,
      totalOrder
    });

    const orderCreated = await this.saveOrderRepository.save(order);

    const orderItemsWithIds = this.setIdsInOrderItems(orderItems as ICreateOrderItemsUsecase.Params, id)

    const orderItemsCreated = await this.createOrderItemsUsecase.execute(this.amountSubTotalOrderItems(orderItemsWithIds))

    await this.updateProductQuantity(orderItemsWithIds);


    console.log({
      message: 'Order created',
      data: { ...orderCreated, orderItems: orderItemsCreated },
    });

    return { ...orderCreated, orderItems: orderItemsCreated };
  }

  private amountOrderItems(orderItems: ICreateOrderUsecase.Params['orderItems']) {
    return orderItems.reduce((acc, orderItem) => {
      return acc + (orderItem.costPerItem * orderItem.quantity);
    }, 0);
  }

  private amountSubTotalOrderItems(orderItems: ICreateOrderItemsUsecase.Params) {
    return orderItems.reduce<ICreateOrderItemsUsecase.Params>((acc, orderItem) => {
      const subTotal = orderItem.costPerItem * orderItem.quantity;

      acc.push({
        ...orderItem,
        subTotal,
      });

      return acc
    }, []);
  }

  private setIdsInOrderItems(orderItems: ICreateOrderItemsUsecase.Params, id: string) {
    return orderItems.map((orderItem) => ({
      ...orderItem,
      orderId: id,
    }))
  }

  private async updateProductQuantity(orderItems: ICreateOrderItemsUsecase.Params) {
    const products = await Promise.all(orderItems.map(async (orderItem) => {
      const product = await this.prismaGetProductByIdGetaways.get(orderItem.productId);

      if (!product?.quantity || product.quantity < orderItem.quantity) {
        throw new OrderItemInsufficientStockException(orderItem);
      }

      const quantity = product.quantity - orderItem.quantity;

      return {
        id: orderItem.productId,
        quantity,
      }
    }));

    await Promise.all(products.map(async (product) => {
      await this.prismaUpdateProductGetaways.update({
        id: product.id,
        quantity: product.quantity,
      });
    }));
  }

}
