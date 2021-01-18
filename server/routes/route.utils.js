module.exports = {
  isAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      return res.status(401).json({
        message: 'Access Denied',
        description: 'You are not authorized to access this resource',
      });
    }
  },
};
