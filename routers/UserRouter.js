import express from 'express';
const Router = express.Router();
import { createUser, verifyEmail } from '../models/user-model/User.model.js';
import {
  createAdminUserValidation,
  adminEmailVerificationValidation,
} from '../middlewares/formValidation.middleware.js';
import { hashPassword } from '../helpers/bcrypt.helper.js';
import {
  createUniqueEmailConfirmation,
  deleteInfo,
  findAdminEmailVerification,
} from '../models/session/Session.model.js';
import {
  sendEmailVerificationConfirmation,
  sendEmailVerificationLink,
} from '../helpers/email.helper.js';

Router.all('/', (req, res, next) => {
  console.log('FROM USER ROUTER');

  next();
});

Router.post('/', createAdminUserValidation, async (req, res) => {
  try {
    const hashPass = hashPassword(req.body.password);

    if (hashPass) {
      req.body.password = hashPass;

      const { _id, fname, email } = await createUser(req.body);

      if (_id) {
        //To DO
        //create unique activation link
        const { pin } = await createUniqueEmailConfirmation(email);

        const forSendingEmail = {
          fname,
          email,
          pin,
        };
        if (pin) {
          //email the link to user email
          sendEmailVerificationLink(forSendingEmail);
        }

        return res.json({
          status: 'success',
          message:
            'NEW USER HAS BEEN CREATED SUCCESSFULLY. We have sent an email-confirmation to your email, please check and follow the instructions to activate your account.',
        });
      }
    }
    res.json({
      status: 'error',
      message: 'UNABLE TO CREATE NEW USER',
    });
  } catch (error) {
    let msg = 'Error, Unable to create new user.';
    console.log(error.message);
    if (error.message.includes('E11000 duplicate key error collection')) {
      msg = 'This email has been used by another user.';
    }
    res.json({
      status: 'error',
      message: msg,
    });
  }
});

//emaill verification
Router.patch(
  '/email-verification',
  adminEmailVerificationValidation,
  async (req, res) => {
    try {
      const result = await findAdminEmailVerification(req.body);

      if (result?._id) {
        //To do
        //information is valid now we can update the user
        //delete teh sesion info
        const data = await verifyEmail(result.email);

        if (data?._id) {
          //delete teh session info
          deleteInfo(req.body);
          //send email confirmation to user

          sendEmailVerificationConfirmation({
            fname: data.fname,
            email: data.email,
          });
          return res.json({
            status: 'success',
            message: 'Your email has now been verified. you can login now.',
          });
        }
      }

      res.json({
        status: 'error',
        message:
          'Unable to verify your email, either the link is invalid or expired.',
      });
    } catch (error) {
      console.log(error);
      res.json({
        status: 'error',
        message: 'Error, Unable to verify the email, please try again later.',
      });
    }
  }
);
export default Router;
