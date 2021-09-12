const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    return res.status(401).send({error: "true", message: "Not authenticated" });
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, `${process.env.JWT_SECRET}`);
    if (!decodedToken) {
      return res.status(401).send({error: "true", message: "Not authenticated" });
    }
    const user = await User.findById(decodedToken.userId);
    if (!user)
      return res.status(404).send({error: true, message: 'The user with the given ID was not found.'});

    if (user.type === "admin") {
      req.userId = decodedToken.userId;
      req.name = decodedToken.name;
      next();
    }
    else {
      return res.status(401).send({error: "true", message: "Unauthorized access" });
    }     
  } catch (error) {
    return res.status(422).send({error: "true", message: "Invalid authorization header" });
  }
};
