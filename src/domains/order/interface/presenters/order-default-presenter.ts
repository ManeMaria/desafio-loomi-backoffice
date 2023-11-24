import { OrderItems } from "@/domains/order/entities";

export interface OrderDefaultPresenter {
  id: string;
  clientId: string;
  status: string;
  totalOrder: number;
  createdAt?: Date;
  updatedAt?: Date;

  // association
  orderItems: OrderItems[];
}
