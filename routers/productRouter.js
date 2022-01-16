import express from 'express';
import slugify from 'slugify';

import {
  addProduct,
  getProducts,
  getProductBySlug,
} from '../models/product/Product.model.js';

import { newProductValidation } from '../middlewares/productFormValidation.middleware.js';

const Router = express.Router();

// Get one or all product
Router.get('/:slug?', async (req, res) => {
  try {
    const { slug } = req.params;
    console.log(req.params);

    const products = slug ? await getProductBySlug(slug) : await getProducts();
    res.json({
      status: 'success',
      message: 'Here are the products.',
      products,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error.',
    });
  }
});

// Add new product
Router.post('/', newProductValidation, async (req, res) => {
  try {
    const slug = slugify(req.body.title, { lower: true });
    const product = await addProduct({ ...req.body, slug });

    product?._id
      ? res.json({
          status: 'success',
          message: 'New product has been added.',
        })
      : res.json({
          status: 'error',
          message:
            'Unable to add the product at the moment, please try again later.',
        });
  } catch (error) {
    console.log(error.message);
    if (error.message.includes('E11000 duplicate key error collection')) {
      return res.json({
        status: 'error',
        message: "Slug can not be same as the existing product's slug.",
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error.',
    });
  }
});

export default Router;
