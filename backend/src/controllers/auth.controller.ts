import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { z } from 'zod';
import { RequestWithUser } from '../middleware/auth.middleware';
import { prisma } from '../lib/prisma-client';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const refreshSchema = z.object({
  refreshToken: z.string(),
});

const authService = new AuthService();

export class AuthController {
  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = loginSchema.parse(req.body);

      const user = await authService.validateUser(email, password);
      if (!user) {
        res.status(400).json({ message: 'Invalid credentials' });
        return;
      }

      const tokens = authService.generateTokens(user.id);
      await authService.saveRefreshToken(user.id, tokens.refreshToken);

      res.status(200).json({
        message: 'Login successful',
        data: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          user: {
            id: user.id,
            email: user.email,
            organizationId: user.organizationId,
          },
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid input' });
        return;
      }
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public refresh = async (req: Request, res: Response): Promise<void> => {
    try {
      const { refreshToken } = refreshSchema.parse(req.body);

      const tokens = await authService.refreshTokens(refreshToken);

      res.json({
        message: 'Tokens refreshed successfully',
        data: tokens,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid input' });
        return;
      }
      res.status(401).json({ message: 'Invalid refresh token' });
    }
  };

  public getCurrentUser = async (
    req: RequestWithUser,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user?.sub;

      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
        select: {
          id: true,
          email: true,
          organizationId: true,
        },
      });

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.json({
        user,
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };
}
