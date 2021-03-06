import express from 'express';
const Router = express.Router();
import {
  createUser,
  verifyEmail,
  getUserByEmail,
  removeRefreshJWT,
  updateUserProfile,
  updateUserProfileByEmail,
} from '../models/user-model/User.model.js';
import { removeSession } from '../models/session/Session.model.js';
import {
  createAdminUserValidation,
  loginUserFormValidation,
  adminEmailVerificationValidation,
  passwordUpdateFormValidation,
  forgetPasswordResetFormValidation,
} from '../middlewares/formValidation.middleware.js';
import { isAdminUser } from '../middlewares/auth.middleware.js';
import { hashPassword, comparePassword } from '../helpers/bcrypt.helper.js';
import {
  createUniqueEmailConfirmation,
  deleteInfo,
  findAdminEmailVerification,
} from '../models/reset-pin/Pin.model.js';
import {
  sendEmailVerificationConfirmation,
  sendEmailVerificationLink,
  sendPasswordUpdateNotification,
} from '../helpers/email.helper.js';
import { getJWTs } from '../helpers/jwt.helper.js';

Router.all('/', (req, res, next) => {
  next();
});

// Return user
Router.get('/', isAdminUser, async (req, res) => {
  req.user.password = undefined;
  req.user.refreshJWT = undefined;
  res.json({
    status: 'success',
    message: 'User Profile',
    user: req.user,
  });
});

// create new user
Router.post('/', isAdminUser, createAdminUserValidation, async (req, res) => {
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

// update user
Router.patch('/', isAdminUser, async (req, res) => {
  try {
    const { _id } = req.user;

    if (_id) {
      const result = await updateUserProfile(_id, req.body);

      if (result?._id) {
        return res.json({
          status: 'success',
          message: 'User profile has been updated successfully.',
        });
      }
    }
    return res.json({
      status: 'error',
      message: 'Unable to update the user. Please try again later.',
    });
  } catch (error) {
    console.log(error.message);
    return res.json({
      status: 'error',
      message: 'Error, Unable to update the user.',
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

//user login
Router.post('/login', loginUserFormValidation, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await getUserByEmail(email);

    if (user?._id && user?.role === 'admin') {
      // check if password is valid or not
      const isPassMatch = comparePassword(password, user.password);
      if (isPassMatch) {
        // get JWTs and send to client
        const JWTs = await getJWTs({ _id: user._id, email: user.email });
        user.password = undefined;
        return res.json({
          status: 'success',
          message: 'Login Success',
          JWTs,
          user,
        });
      }
    }
    res.status(401).json({
      status: 'error',
      message: 'Unauthorized',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error, unable to login now, please try again later',
    });
  }
});
// user logout
Router.post('/logout', async (req, res) => {
  try {
    const { accessJWT, refreshJWT } = req.body;
    accessJWT && (await removeSession(accessJWT));
    refreshJWT && (await removeRefreshJWT(refreshJWT));
    res.json({
      status: 'success',
      message: 'Logging Out...',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error, unable to login now, please try again later',
    });
  }
});

// password update when logged in
Router.post(
  '/password-update',
  isAdminUser,
  passwordUpdateFormValidation,
  async (req, res) => {
    try {
      const { _id, password, fname, email } = req.user;
      const { currentPassword } = req.body;

      // make sure the current password matches with the password in database

      const passMatched = comparePassword(currentPassword, password);
      if (passMatched) {
        // encrypt the new password and store in db
        const hashedPass = hashPassword(req.body.password);
        if (hashedPass) {
          //update user table
          const user = await updateUserProfile(_id, { password: hashedPass });

          if (user._id) {
            res.json({
              status: 'success',
              message: 'Password has been updated.',
            });
            // send the notification email saying password is updated

            sendPasswordUpdateNotification({ fname, email });
            return;
          }
        }
      }

      res.json({
        status: 'error',
        message:
          'Error, unable to update the password at the moment. Please try again later.',
      });
    } catch (error) {
      res.json({
        status: 'error',
        message: 'Error, unable to process your request.',
      });
    }
  }
);
// password reset when logged out
Router.post(
  '/reset-password',
  forgetPasswordResetFormValidation,
  async (req, res) => {
    try {
      const { otp, password, email } = req.body;

      // validate otp and email exist in db
      const filter = { pin: otp, email };
      const hasOtp = await findAdminEmailVerification(filter);
      if (hasOtp?._id) {
        // encrypt the new password
        const hashedPass = hashPassword(password);
        if (hashedPass) {
          // update user table with teh new password
          const user = await updateUserProfileByEmail(email, {
            password: hashedPass,
          });
          if (user?._id) {
            res.json({
              status: 'success',
              message: 'Password has been updated. You may login now.',
            });
            // send the notification email saying password is updated

            sendPasswordUpdateNotification({ email });

            // Don't forget to delete the OTP set from db
            deleteInfo({ filter });

            return;
          }
        }
      }

      res.json({
        status: 'error',
        message:
          'Error, unable to update the password at the moment. Please try again later.',
      });
    } catch (error) {
      res.json({
        status: 'error',
        message: 'Error, unable to process your request.',
      });
    }
  }
);

export default Router;
