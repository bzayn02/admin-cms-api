import Joi from 'joi';

const longStr = Joi.string().max(3000).required();
const shortStrNull = Joi.string().max(50).allow(null).allow('');
const _id = Joi.string().max(30);
const number = Joi.number();
const title = Joi.string().max(100).required();
const price = Joi.number().max(10000);
const date = Joi.date();
const quantity = Joi.number().max(10000);

export const newPaymentOptionValidation = (req, res, next) => {
  try {
    const schema = Joi.object({
      status: Joi.boolean(),
      name: title,
      info: Joi.string(),
    });

    const values = schema.validate(req.body);
    if (values.error) {
      return res.json({
        status: 'error',
        message: values.error.message,
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
};
