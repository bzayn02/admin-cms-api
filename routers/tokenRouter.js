import express from 'express';
import { sendPasswordResetOTP } from '../helpers/email.helper.js';
import { createAccessJWT, verifyRefreshJWT } from '../helpers/jwt.helper.js';
import { createUniqueOTP } from '../models/reset-pin/Pin.model.js';
import {
  getUserByEmailAndRefreshToken,
  getUserByEmail,
} from '../models/user-model/User.model.js';

const Router = express.Router();

Router.all('/', (req, res, next) => {
  next();
});

Router.get('/', async (req, res) => {
  try {
    const { authorization } = req.headers;

    // 1. Check if the token is valid
    const { email } = verifyRefreshJWT(authorization);

    // 2. Get the user info
    if (email) {
      //get user id from db by email
      const filter = {
        email,
        refreshJWT: authorization,
      };

      const user = await getUserByEmailAndRefreshToken(filter);
      if (user?._id) {
        // 3. Create access JWT and store in db
        const accessJWT = await createAccessJWT({ _id: user._id, email });

        // 4. Return the new accessJWT
        return res.json({
          accessJWT,
        });
      }
    }

    res.status(401).json({
      status: 'error',
      message: 'Unauthenticated!',
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      status: 'error',
      message: 'Unauthenticated!',
    });
  }
});

//Request OTP for password Reset
Router.post('/request-otp', async (req, res) => {
  try {
    // get email
    const { email } = req.body;

    // get the user by email
    if (email) {
      const user = await getUserByEmail(email);
      if (user?._id) {
        // create OTP and store in token table along with U_ID

        const result = await createUniqueOTP({
          email,
          type: 'passwordResetOTP',
        });
        if (!result?._id) {
          return res.json({
            status: 'error',
            message: 'Please try again later.',
          });
        }
        // send email with the OTP
        const emailObj = { email, otp: result.pin, fname: user.fname };
        sendPasswordResetOTP(emailObj);
      }
    }

    res.json({
      status: 'success',
      message:
        'If the email exists in our system, OTP will be sent to the email shortly. OTP will expire in 15 minutes.',
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: 'error',
      message: 'Error, unable to process your request',
    });
  }
});

export default Router;
