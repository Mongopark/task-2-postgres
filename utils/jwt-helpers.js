import jwt from 'jsonwebtoken';

// Generate an access token and a refresh token for this database user
function jwtTokens({ userid, firstName, lastName, email }) {
  const user = { userid, firstName, lastName, email };
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '50m' });
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '59m' });
  return ({ accessToken, refreshToken });
}

export { jwtTokens };
