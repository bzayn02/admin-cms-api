import express from 'express';
const Router = express.Router();

import {
  storePaymentOptions,
  getAllPaymentOptions,
} from '../models/payment-options/PaymentOptions.model.js';
import { newPaymentOptionValidation } from '../middlewares/paymentValidation.middleware.js';

Router.get('/', async (req, res) => {
  try {
    const result = await getAllPaymentOptions();
    res.json({
      status: 'success',
      message: 'Here are the payment options.',
      options: result,
    });
  } catch (error) {
    return res.json({
      status: 'error',
      message:
        'Error, Unable to add the payment option, please try again later.',
    });
  }
});

Router.post('/', newPaymentOptionValidation, async (req, res) => {
  try {
    const result = await storePaymentOptions(req.body);
    if (result?._id) {
      return res.json({
        status: 'success',
        message: 'New payment option has been added successfully.',
      });
    }
    return res.json({
      status: 'error',
      message: 'Unable to add the payment option, please try again later.',
    });
  } catch (error) {
    console.log(error.message);
    return res.json({
      status: 'error',
      message:
        'Error, Unable to add the payment option, please try again later.',
    });
  }
});

export default Router;
