const UserModel = require('../models/users.model');

const verifyUserDetailAccess = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    const email = req.user?.email;

    if (!token) {
      return res.status(401).send({ message: 'Unauthorized access' });
    }

    if (email) {
      // Find user by email
      const user = await UserModel.findOne({ officeEmail: email });

      if (!user) {
        return res.status(401).send({ message: 'Unauthorized access' });
      }

      const userId = user.userId;

      if (
        userId == req.params?.userId ||
        user.personalInfo?.designation === 'hr' ||
        user.personalInfo?.designation === 'co_ordinator' ||
        user.personalInfo?.designation === 'ceo'
      ) {
        console.log(`User ${userId} is authorized`);
        next();
      } else {
        return res
          .status(403)
          .send({ message: 'Forbidden: You do not have access' });
      }
    } else {
      return res.status(401).send({ message: 'Unauthorized access' });
    }
  } catch (error) {
    console.error('Error in verifyUserDetailAccess middleware:', error);
    return res.status(500).send({ message: 'Internal server error' });
  }
};

module.exports = verifyUserDetailAccess;
