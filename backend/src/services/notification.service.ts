import { prisma } from '../lib/prisma-client';

export class NotificationService {
  async getUnreadNotificationsCount(userId: number): Promise<number> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { organizationId: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const count = await prisma.reportAssignment.count({
      where: {
        organizationId: user.organizationId,
        viewedAt: null,
      },
    });

    return count;
  }
}
