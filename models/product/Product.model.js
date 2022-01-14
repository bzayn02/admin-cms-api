import ProductSchema from './Product.Schema.js';

export const addProduct = (prodInfo) => {
  return ProductSchema(prodInfo).save();
};

export const getProductBySlug = (slug) => {
  return ProductSchema.findOne({ slug });
};

export const getProducts = () => {
  return ProductSchema.find();
};
