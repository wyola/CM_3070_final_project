import jwt, { SignOptions } from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.config';

export const generateAccessToken = (userId: number) => {
  return jwt.sign({ sub: userId }, jwtConfig.accessToken.secret, {
    expiresIn: jwtConfig.accessToken.expiresIn,
  } as SignOptions);
};

export const generateRefreshToken = (userId: number) => {
  return jwt.sign({ sub: userId }, jwtConfig.refreshToken.secret, {
    expiresIn: jwtConfig.refreshToken.expiresIn,
  } as SignOptions);
};
