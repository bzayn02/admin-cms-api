import mongoose from 'mongoose';

const ProductSchema = mongoose.Schema(
  {
    status: {
      type: Boolean,
      default: false,
      required: true,
    },
    title: {
      type: String,
      default: '',
      maxLength: 100,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      maxLength: 100,
      default: '',
      unique: true,
      index: 1,
    },
    price: {
      type: Number,
      default: 0,
      max: 10000,
      required: true,
    },
    salePrice: {
      type: Number,
      default: 0,
      max: 10000,
    },
    saleStartDate: {
      type: Date,
      default: null,
    },
    saleEndDate: {
      type: Date,
      default: null,
    },
    brand: {
      type: String,
      default: '',
      maxLength: 50,
    },
    quantity: {
      type: Number,
      default: 0,
      max: 10000,
      required: true,
    },
    thumbnail: {
      type: String,
      default: '',
      maxLength: 1000,
    },
    images: {
      type: Array,
    },
    description: {
      type: String,
      default: '',
      maxLength: 3000,
      required: true,
    },
    categories: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Product', ProductSchema);
