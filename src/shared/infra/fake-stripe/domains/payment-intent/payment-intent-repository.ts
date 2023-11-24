/* eslint-disable camelcase */

import {
  IStripePaymentIntentClass,
  PaymentIntentConfirm
} from '@/main/infra/fake-stripe';

import { StripeConfirmMethodException } from '@/shared/infra/fake-stripe/fake-stripe-confirm-method-exception';

export class StripePaymentIntentRepository
  implements IStripePaymentIntentClass {

  async confirm(
    params: PaymentIntentConfirm.Params
  ): Promise<PaymentIntentConfirm.Result> {
    const { amount } = params;

    try {
      const paymentIntent = await new Promise((resolve, reject) => {
        Math.random() < 0.5 ? resolve({
          id: 'any',
          amount,
          currency: 'any',
          receipt_email: 'any',
        }) : reject(new Error('Error on confirm payment intent'))
      })

      return paymentIntent as PaymentIntentConfirm.Result;
    } catch (error) {
      throw new StripeConfirmMethodException(
        'Error on confirm payment intent',
      );
    }
  }

}
