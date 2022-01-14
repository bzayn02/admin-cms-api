import ProductSchema from './Product.Schema.js';

export const addProduct = (prodInfo) => {
  return ProductSchema(prodInfo).save();
};
