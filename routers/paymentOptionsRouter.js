import express from 'express';
const Router = express.Router();

import {
  storePaymentOptions,
  getAllPaymentOptions,
  removePaymentOptions,
  updatePaymentOptions,
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

Router.patch('/', async (req, res) => {
  try {
    const { _id, status } = req.body;

    if (_id) {
      const result = await updatePaymentOptions({ _id, status });

      if (result?._id) {
        return res.json({
          status: 'success',
          message: 'The payment option has been updated.',
        });
      }
    }
    res.json({
      status: 'error',
      message:
        'Error, unable to update the payment option, please try again later.',
    });
  } catch (error) {
    return res.json({
      status: 'error',
      message: 'Error, Unable to process the request, please try again later.',
    });
  }
});

Router.delete('/:_id', async (req, res) => {
  try {
    const { _id } = req.params;
    const result = await removePaymentOptions(_id);

    if (result?._id) {
      return res.json({
        status: 'success',
        message: 'The payment option has been successfully deleted.',
      });
    }
    res.json({
      status: 'error',
      message:
        'Error, Unable to delete the payment option, please try again later.',
    });
  } catch (error) {
    return res.json({
      status: 'error',
      message: 'Error, Unable to process the request, please try again later.',
    });
  }
});

export default Router;
