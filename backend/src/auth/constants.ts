export const jwtConstants = {
  secret: process.env.JWT_SECRET,
  expiresIn: '10m',
};

export const oauth42Constants = {
  clientID: process.env.OAUTH42_CLIENT_ID,
  clientSecret: process.env.OAUTH42_CLIENT_SECRET,
  callbackURL: process.env.OAUTH42_REDIRECT_URI,
};

export const bcryptConstants = {
  saltRounds: 10,
};
