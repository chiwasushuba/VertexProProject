const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "Authorization token is required" });
  }
  const token = authorization.split(' ')[1];
  try {
    const { _id } = jwt.verify(token, process.env.SECRET);
    const user = await User.findOne({ _id }).select('_id email');
    req.user = user; // Now req.user contains _id and email
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: "Authorization is not authorized" });
  }
}
module.exports = requireAuth