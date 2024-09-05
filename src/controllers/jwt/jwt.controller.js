const jwt = require('jsonwebtoken');
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
};
exports.PostJwt = async (req, res) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.TOKEN_SECRET, {
    expiresIn: '24h',
  });
  res.cookie('token', token, cookieOptions).send({ success: true });
};
exports.RemoveJwt = async (req, res) => {
  const user = req.body;
  console.log('logging out', user);
  res
    .clearCookie('token', { ...cookieOptions, maxAge: 0 })
    .send({ success: true });
};