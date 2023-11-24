import { IStripePaymentIntent } from './entity';


export namespace PaymentIntentConfirm {
  export type Params = {
    amount: number;
    currency: string;
    customer: string;
    installments: number;
    receipt_email?: string;
  };

  export type Result = IStripePaymentIntent;
}

export interface IStripePaymentIntentClass {
  confirm(
    params: PaymentIntentConfirm.Params
  ): Promise<PaymentIntentConfirm.Result>;

}
