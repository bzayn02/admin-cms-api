import UserSchema from './User.schema.js';

export const createUser = (newUser) => {
  try {
    const result = UserSchema(newUser).save();
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
export const updateUserProfile = (_id, updatingInfo) => {
  try {
    const result = UserSchema.findByIdAndUpdate(_id, updatingInfo, {
      new: true,
    });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
export const updateUserProfileByEmail = (email, updatingInfo) => {
  try {
    const result = UserSchema.findOneAndUpdate({ email }, updatingInfo, {
      new: true,
    });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const verifyEmail = (email) => {
  try {
    return UserSchema.findOneAndUpdate(
      { email },
      {
        isEmailConfirmed: true,
      },
      {
        new: true,
      }
    );
  } catch (error) {
    throw new Error(error);
  }
};

export const setRefreshJWT = (_id, token) => {
  return UserSchema.findByIdAndUpdate(_id, {
    refreshJWT: token,
  });
};

export const getUserByEmail = (email) => {
  return UserSchema.findOne({ email });
};

export const getUserByID = (id) => {
  return UserSchema.findById(id);
};

export const getUserByEmailAndRefreshToken = (filter) => {
  return UserSchema.findOne(filter);
};
export const removeRefreshJWT = (refreshJWT) => {
  return UserSchema.findOneAndUpdate({ refreshJWT }, { refreshJWT: '' });
};
