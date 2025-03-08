import { Router } from 'express';
import { NeedController } from '../controllers/need.controller';
import { authenticateJWT } from '../middleware/auth.middleware';
import { isOrganizationOwner } from '../middleware/organization-owner.middleware';

// Create a router that merges parameters from parent router
const router = Router({ mergeParams: true });
const needController = new NeedController();

/**
 * @swagger
 * components:
 *   schemas:
 *     Need:
 *       type: object
 *       required:
 *         - id
 *         - kind
 *         - priority
 *         - description
 *       properties:
 *         id:
 *           type: integer
 *         description:
 *           type: string
 *         priority:
 *           type: boolean
 *         kind:
 *           type: string
 *           enum: [accessories, bedding, cleaning, food, grooming, medication, other, toys, vet]
 *           description: Types of animals the organization handles
 */

/**
 * @swagger
 * /api/organizations/{organizationId}/needs:
 *   post:
 *     tags: [Needs]
 *     summary: Create a new need for an organization
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Organization ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - kind
 *               - description
 *             properties:
 *               kind:
 *                 type: string
 *                 enum: [accessories, bedding, cleaning, food, grooming, medication, other, toys, vet]
 *                 description: Type of need
 *               priority:
 *                 type: boolean
 *                 default: false
 *                 description: Whether this need is high priority
 *               description:
 *                 type: string
 *                 minLength: 5
 *                 description: Description of the need
 *     responses:
 *       201:
 *         description: Need created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - user does not own this organization
 *       500:
 *         description: Server error
 */
router.post(
  '/',
  authenticateJWT,
  isOrganizationOwner,
  needController.createNeed
);

/**
 * @swagger
 * /api/organizations/{organizationId}/needs:
 *   get:
 *     tags: [Needs]
 *     summary: Get all needs for an organization
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Organization ID
 *     responses:
 *       200:
 *         description: Needs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Needs retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Need'
 *       400:
 *         description: Invalid organization ID
 *       500:
 *         description: Server error
 */
router.get('/', needController.getNeedsByOrganizationId);

/**
 * @swagger
 * /api/organizations/{organizationId}/needs/{needId}:
 *   get:
 *     tags: [Needs]
 *     summary: Get a specific need by ID
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Organization ID
 *       - in: path
 *         name: needId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Need ID
 *     responses:
 *       200:
 *         description: Need retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Need retrieved successfully"
 *                 need:
 *                   $ref: '#/components/schemas/Need'
 *       404:
 *         description: Need not found
 *       500:
 *         description: Server error
 */
router.get('/:needId', needController.getNeedById);

/**
 * @swagger
 * /api/organizations/{organizationId}/needs/{needId}:
 *   delete:
 *     tags: [Needs]
 *     summary: Delete a specific need by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Organization ID
 *       - in: path
 *         name: needId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Need ID
 *     responses:
 *       200:
 *         description: Need deleted successfully
 *       404:
 *         description: Need not found
 *       403:
 *         description: Forbidden - user does not own this organization
 *       500:
 *         description: Server error
 */
router.delete(
  '/:needId',
  authenticateJWT,
  isOrganizationOwner,
  needController.deleteNeed
);

/**
 * @swagger
 * /api/organizations/{organizationId}/needs/{needId}:
 *   put:
 *     tags: [Needs]
 *     summary: Update a specific need by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Organization ID
 *       - in: path
 *         name: needId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Need ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               kind:
 *                 type: string
 *                 enum: [accessories, bedding, cleaning, food, grooming, medication, other, toys, vet]
 *                 description: Type of need
 *               priority:
 *                 type: boolean
 *                 description: Whether this need is high priority
 *               description:
 *                 type: string
 *                 minLength: 5
 *                 description: Description of the need
 *     responses:
 *       200:
 *         description: Need updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Need updated successfully"
 *                 need:
 *                   $ref: '#/components/schemas/Need'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Need not found
 *       403:
 *         description: Forbidden - user does not own this organization
 *       500:
 *         description: Server error
 */
router.put(
  '/:needId',
  authenticateJWT,
  isOrganizationOwner,
  needController.updateNeed
);

export default router;
