const UserModel = require('../models/users.model');

const verifyCoordinator = async (req, res, next) => {
  const token = req.cookies?.token;
  const email = req.user?.email;

  if (!token) {
    return res.status(401).send({ message: 'Unauthorized access' });
  }

  if (email) {
    const user = await UserModel.findOne({ officeEmail: email });

    if (user && user?.personalInfo?.designation === 'co_ordinator') {
      console.log(user.role);
      next();
    } else {
      return res.status(403).send({ message: 'Forbidden: Coordinator only' });
    }
  } else {
    return res.status(401).send({ message: 'Unauthorized access' });
  }
};

module.exports = verifyCoordinator;
