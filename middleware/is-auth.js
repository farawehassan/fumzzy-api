const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    return res.send({status: 401, error: "true", message: "Not authenticated" });
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, `${process.env.JWT_SECRET}`);
  } catch (error) {
    return res.send({status: 422, error: "true", message: "Invalid authorization token" });
  }
  if (!decodedToken) {
    return res.send({status: 401, error: "true", message: "Not authenticated" });
  }
  req.userId = decodedToken.userId;
  req.name = decodedToken.name;
  next();
};
