import bcrypt from 'bcrypt';
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.config';
import { prisma } from '../lib/prisma-client';

export class AuthService {
  async validateUser(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);

    return isPasswordValid ? user : null;
  }

  generateTokens(userId: number) {
    const accessToken = jwt.sign(
      { sub: userId },
      jwtConfig.accessToken.secret,
      {
        expiresIn: jwtConfig.accessToken.expiresIn,
      } as SignOptions
    );

    const refreshToken = jwt.sign(
      { sub: userId },
      jwtConfig.refreshToken.secret,
      {
        expiresIn: jwtConfig.refreshToken.expiresIn,
      } as SignOptions
    );

    return { accessToken, refreshToken };
  }

  async saveRefreshToken(userId: number, refreshToken: string) {
    const expiresAt = new Date();
    const days = AuthService.parseJwtExpiresInAsDays(
      jwtConfig.refreshToken.expiresIn
    );
    expiresAt.setDate(expiresAt.getDate() + days);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId,
        expiresAt,
      },
    });
  }

  async refreshTokens(refreshToken: string) {
    try {
      const decoded = jwt.verify(
        refreshToken,
        jwtConfig.refreshToken.secret
      ) as JwtPayload;

      if (!decoded.sub) {
        throw new Error('Invalid token payload');
      }

      const userId = parseInt(decoded.sub, 10);

      const existingToken = await prisma.refreshToken.findFirst({
        where: { token: refreshToken, userId: userId },
      });

      if (!existingToken) throw new Error('Invalid refresh token');

      const tokens = this.generateTokens(userId);

      // Delete old refresh token and save new one
      await prisma.refreshToken.delete({ where: { id: existingToken.id } });
      await this.saveRefreshToken(userId, tokens.refreshToken);

      return tokens;
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  private static parseJwtExpiresInAsDays(expiresIn: string): number {
    const match = expiresIn.match(/^(\d+)([dhms])$/);
    if (!match) throw new Error('Invalid expiresIn format');

    const [, value, unit] = match;
    const days = {
      d: parseInt(value),
      h: parseInt(value) / 24,
      m: parseInt(value) / (24 * 60),
      s: parseInt(value) / (24 * 60 * 60),
    }[unit];

    return days || 1;
  }
}
