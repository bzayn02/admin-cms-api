import express from 'express';
const Router = express.Router();
import slugify from 'slugify';

import {
  addCategory,
  getAllCats,
  getACat,
  deleteCat,
  updateCat,
} from '../models/category/Category.model.js';
import {
  newCategoryValidation,
  updateCategoryValidation,
} from '../middlewares/formValidation.middleware.js';

Router.all('/', (req, res, next) => {
  next();
  // res.json({
  //   status: 'success',
  //   message: 'from category Router',
  // });
});

//return single or all categories

Router.get('/:_id?', async (req, res) => {
  try {
    const { _id } = req.params;
    let result;
    if (_id) {
      result = await getACat(_id);
    } else {
      result = await getAllCats();
    }

    res.json({
      status: 'success',
      message: 'All the categories',
      categories: result || [],
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: 'error',
      message: error.message,
    });
  }
});

// Create new category
Router.post('/', newCategoryValidation, async (req, res) => {
  try {
    const slug = slugify(req.body.name, { lower: true });
    req.body.parentCat = req.body.parentCat ? req.body.parentCat : null;
    const result = await addCategory({ ...req.body, slug });

    const status = result?._id ? 'success' : 'error';
    const message = result?._id
      ? 'Category has been created successfully'
      : 'Unable to create the category, please try again later';
    res.json({ status, message });
  } catch (error) {
    console.log(error);

    let msg =
      'Error, Unable to add new category at the moment, please try again later.';
    if (error.message.includes('E11000 duplicate key error collection')) {
      msg = 'Error, the category already exists.';
    }
    console.log(error);
    res.json({
      status: 'error',
      message: msg,
    });
  }
});

//update category
Router.patch('/', updateCategoryValidation, async (req, res) => {
  try {
    //update database
    const result = await updateCat(req.body);
    if (result?._id) {
      return res.json({
        status: 'success',
        message: 'The category has been updated.',
      });
    }

    res.json({
      status: 'error',
      message: 'Error, Invalid request.',
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: 'error',
      message: 'Error, Unable to update the category.',
    });
  }
});

//delete category
Router.delete('/:_id', async (req, res) => {
  try {
    const { _id } = req.params;
    const result = await deleteCat(_id);
    if (result?._id) {
      return res.json({
        status: 'success',
        message: 'The category has been deleted.',
      });
    }

    res.json({
      status: 'error',
      message: 'Error, Invalid request.',
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: 'error',
      message: 'Error, Unable to delete the category.',
    });
  }
});

export default Router;
