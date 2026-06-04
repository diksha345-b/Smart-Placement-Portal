const jwt = require('jsonwebtoken');

/**
 * Sign a JWT for an authenticated user. The token carries the user id and
 * role so role-based middleware can authorize without an extra DB lookup
 * (the lookup still happens in `protect` to confirm the account exists).
 */
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

module.exports = generateToken;
