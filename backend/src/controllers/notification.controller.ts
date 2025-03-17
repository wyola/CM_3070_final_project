import { Response } from 'express';
import { RequestWithUser } from '../middleware/auth.middleware';
import { NotificationService } from '../services/notification.service';

const notificationService = new NotificationService();

export class NotificationController {
  public getNotificationsCount = async (
    req: RequestWithUser,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user?.sub;

      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const count = await notificationService.getUnreadNotificationsCount(
        parseInt(userId)
      );

      res.status(200).json({ count });
    } catch (error) {
      console.error('Error getting notifications count:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
}
