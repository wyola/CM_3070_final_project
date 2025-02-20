export const jwtConfig = {
  accessToken: {
    secret: process.env.JWT_ACCESS_SECRET || 'animal-allies-secret-key',
    expiresIn: '15m',
  },
  refreshToken: {
    secret:
      process.env.JWT_REFRESH_SECRET || 'animal-allies-refresh-secret-key',
    expiresIn: '7d',
  },
};
