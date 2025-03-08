import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { RequestWithUser } from './auth.middleware';

const prisma = new PrismaClient();

export const isOrganizationOwner = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.sub;

  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const organizationId = parseInt(req.params.organizationId);

  if (isNaN(organizationId)) {
    res.status(400).json({ message: 'Invalid organization ID' });
    return;
  }

  // Check if the user is associated with the organization
  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId) },
    include: { organization: true },
  });

  if (!user || user.organizationId !== organizationId) {
    res.status(403).json({
      message:
        'Forbidden: You do not have permission to manage this organization',
    });
    return;
  }

  next();
};
