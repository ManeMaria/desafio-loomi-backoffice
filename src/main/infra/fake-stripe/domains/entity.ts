
export interface IStripePaymentIntent {
  id: string;
  amount: number;
  currency: string;
  receipt_email: string;
}
