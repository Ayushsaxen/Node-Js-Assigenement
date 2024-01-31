// middleware/authorize.js
const authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).send("Permission Denied");
    }
    next();
  };
};

module.exports = { authorize };
