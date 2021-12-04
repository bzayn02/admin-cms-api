import mongoose from 'mongoose';

//fname, lname, dob, email, phone, password, address, gender, role
const UserSchema = mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      default: 'Active',
    },
    fname: {
      type: String,
      required: true,
      default: '',
      max: 20,
    },
    lname: {
      type: String,
      required: true,
      default: '',
      max: 20,
    },
    dob: {
      type: Date,
    },
    email: {
      type: String,
      required: true,
      default: '',
      max: 50,
      unique: true,
      index: 1,
    },
    isEmailConfirmed: {
      type: Boolean,
      default: false,
      required: true,
    },
    phone: {
      type: String,
      max: 15,
    },
    password: {
      type: String,
      required: true,
      default: '',
      min: 8,
    },
    address: {
      type: String,
      max: 100,
    },
    gender: {
      type: String,
    },
    role: {
      type: String,
      required: true,
      default: 'user',
    },
    refreshJWT: {
      type: String,
      default: '',
    },
  },
  {
    timestapms: true,
  }
);

const user = mongoose.model('User', UserSchema);

export default user;
