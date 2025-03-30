import jwt from 'jsonwebtoken';
import { jwtConfig } from '../../config/jwt.config';
import { generateAccessToken, generateRefreshToken } from '../../lib/jwt';

describe('JWT Token Generation', () => {
  const userId = 123;

  describe('generateAccessToken', () => {
    it('should generate a valid JWT access token', () => {
      const token = generateAccessToken(userId);

      const decoded = jwt.verify(
        token,
        jwtConfig.accessToken.secret
      ) as jwt.JwtPayload;

      expect(decoded).toBeTruthy();
      expect(decoded.sub).toBe(userId);
      expect(typeof decoded.exp).toBe('number');
      expect(decoded.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a valid JWT refresh token', () => {
      const token = generateRefreshToken(userId);

      const decoded = jwt.verify(
        token,
        jwtConfig.refreshToken.secret
      ) as jwt.JwtPayload;

      expect(decoded).toBeTruthy();
      expect(decoded.sub).toBe(userId);
      expect(typeof decoded.exp).toBe('number');
      expect(decoded.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
    });
  });
});
