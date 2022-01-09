import { verifyAccessJWT } from '../helpers/jwt.helper.js';
import { getSession } from '../models/session/Session.model.js';
import { getUserByID } from '../models/user-model/User.model.js';

export const isAdminUser = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (authorization) {
      //validate the accessJWT
      const decoded = verifyAccessJWT(authorization);

      if (decoded === 'jwt expired') {
        return res.status(403).json({
          status: 'error',
          message: 'jwt expired',
        });
      }
      const session = decoded?.email
        ? await getSession({ token: authorization })
        : null;
      if (session?._id) {
        // get the admin user from DB and check for the role
        const user = await getUserByID(session.userID);
        if (user?.role === 'admin') {
          req.user = user;

          next();
          return;
        }
      }
    }
    return res.status(401).json({
      status: 401,
      message: 'Unauthenticated!',
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Server error!',
    });
  }
};
