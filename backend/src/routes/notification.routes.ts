import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();
const notificationController = new NotificationController();

/**
 * @swagger
 * /api/notifications/count:
 *   get:
 *     tags: [Notifications]
 *     summary: Get unread notifications count for the current user
 *     description: Returns the count of unread reports assigned to the user's organization
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications count retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Number of unread notifications
 *                   example: 5
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get(
  '/count',
  authenticateJWT,
  notificationController.getNotificationsCount
);

export default router;
