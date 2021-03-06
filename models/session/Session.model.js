import SessionSchema from './Session.schema.js';

export const storeSession = (tokenObj) => {
  return SessionSchema(tokenObj).save();
};
export const getSession = (token) => {
  return SessionSchema.findOne(token);
};

export const removeSession = (token) => {
  return SessionSchema.deleteOne({ token: token });
};
