import PinSchema from './Pin.schema.js';
import { randomNumberGenerator } from '../../utils/randomGenerator.js';

//To create a unique email validation info

export const createUniqueEmailConfirmation = async (email) => {
  try {
    // generate random 6 digit numbers
    const pinLength = 6;
    const pin = randomNumberGenerator(pinLength);

    if (!pin || !email) {
      return false;
    }
    const newEmailValidation = {
      pin,
      email,
    };

    const result = await PinSchema(newEmailValidation).save();
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const findAdminEmailVerification = async (filterObj) => {
  try {
    // generate random 6 digit numbers

    const result = await PinSchema.findOne(filterObj);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteInfo = async (filterObj) => {
  try {
    const result = await PinSchema.findOneAndDelete(filterObj);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
