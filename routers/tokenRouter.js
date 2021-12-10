import express from 'express';
import { createAccessJWT, verifyRefreshJWT } from '../helpers/jwt.helper.js';
import { getUserByEmailAndRefreshToken } from '../models/user-model/User.model.js';

const Router = express.Router();

Router.all('/', (req, res, next) => {
  console.log('token got hit');
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
        console.log(accessJWT, 'new accessJWT');

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
export default Router;
