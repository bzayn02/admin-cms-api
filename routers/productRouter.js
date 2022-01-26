import express from 'express';
import slugify from 'slugify';
import multer from 'multer';

import {
  addProduct,
  getProducts,
  getProductBySlug,
  deleteProductById,
} from '../models/product/Product.model.js';

import { newProductValidation } from '../middlewares/productFormValidation.middleware.js';

import { isAdminUser } from '../middlewares/auth.middleware.js';

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

// Configure multer for validation and upload destination
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(file);
    let error = null;
    //validation test
    cb(error, 'public/img/products');
  },

  filename: (req, file, cb) => {
    const fileNameArg = file.originalname.split('.');
    const fileName = slugify(fileNameArg[0], { lower: true });
    const fullFileName = fileName + '-' + Date.now() + '.' + fileNameArg[1];
    cb(null, fullFileName);
  },
});

const upload = multer({ storage });

// Add new product
Router.post(
  '/',
  upload.array('images', 5),
  newProductValidation,
  async (req, res) => {
    try {
      console.log(req.files);

      //file zone
      const files = req.files;
      const images = [];
      const basePath = `${req.protocol}://${req.get('host')}/img/products/`;

      files.map((file) => {
        const imgFullPath = basePath + file.filename;
        images.push(imgFullPath);
      });

      //

      const slug = slugify(req.body.title, { lower: true });
      const product = await addProduct({ ...req.body, slug, images });

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
  }
);

// Delete product
Router.delete('/:_id', async (req, res) => {
  try {
    const { _id } = req.params;
    if (_id) {
      const result = await deleteProductById(_id);
      if (result?._id) {
        return res.json({
          status: 'success',
          message: 'Product has been deleted.',
        });
      }
    }
    res.json({
      status: 'error',
      message: 'Product not found. Invalid Request',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
});
export default Router;
