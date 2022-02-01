import PaymentOptionsSchema from './PaymentOptions.schema.js';

export const storePaymentOptions = (paymentObj) => {
  return PaymentOptionsSchema(paymentObj).save();
};
export const getPaymentOptions = (_id) => {
  return PaymentOptionsSchema.findById(_id);
};
export const getAllPaymentOptions = () => {
  return PaymentOptionsSchema.find();
};

export const removePaymentOptions = (_id) => {
  return PaymentOptionsSchema.findByIdAndDelete(_id);
};
export const updatePaymentOptions = ({ _id, status }) => {
  return PaymentOptionsSchema.findByIdAndUpdate(_id, { status });
};
