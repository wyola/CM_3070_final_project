import { Router } from 'express';
import multer from 'multer';
import { ReportController } from '../controllers/report.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();
const reportController = new ReportController();

const storage = multer.diskStorage({
  destination: './uploads/temp',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Report:
 *       type: object
 *       required:
 *         - id
 *         - title
 *         - description
 *         - status
 *         - createdAt
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         address:
 *           type: string
 *           nullable: true
 *         city:
 *           type: string
 *           nullable: true
 *         postalCode:
 *           type: string
 *           nullable: true
 *           description: Format XX-XXX where X is a digit
 *           example: "00-001"
 *         geolocation:
 *           type: object
 *           nullable: true
 *           properties:
 *             lat:
 *               type: number
 *             lon:
 *               type: number
 *         image:
 *           type: string
 *           nullable: true
 *         contactName:
 *           type: string
 *           nullable: true
 *         contactEmail:
 *           type: string
 *           nullable: true
 *         contactPhone:
 *           type: string
 *           nullable: true
 *         status:
 *           type: string
 *           enum: [OPEN, IN_PROGRESS, HANDLED]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         assignments:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               organizationId:
 *                 type: integer
 *               organizationName:
 *                 type: string
 *               viewedAt:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *         animals:
 *           type: array
 *           items:
 *             type: string
 *             enum: [dogs, cats, farm animals, wild animals, exotic animals, birds, horses, other]
 *           description: Types of animals involved in the report
 */

/**
 * @swagger
 * /api/reports:
 *   post:
 *     tags: [Reports]
 *     summary: Create a new animal abuse report
 *     description: Create a new animal abuse report. Either complete address (street and city) or geolocation must be provided.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - animals
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 100
 *                 description: Report title
 *               description:
 *                 type: string
 *                 minLength: 20
 *                 description: Detailed description of the situation
 *               address:
 *                 type: string
 *                 description: Street address where the abuse is occurring
 *               city:
 *                 type: string
 *                 description: City where the abuse is occurring
 *               postalCode:
 *                 type: string
 *                 pattern: '^[0-9]{2}-[0-9]{3}$'
 *                 description: Postal code in format XX-XXX where X is a digit
 *                 example: "00-001"
 *               geolocation:
 *                 type: string
 *                 description: JSON string with lat/lon coordinates
 *                 example: '{"lat": 52.2297, "lon": 21.0122}'
 *               contactName:
 *                 type: string
 *                 description: Name of the person reporting (optional)
 *               contactEmail:
 *                 type: string
 *                 format: email
 *                 description: Email of the person reporting (optional)
 *               contactPhone:
 *                 type: string
 *                 description: Phone number of the person reporting (optional)
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image showing the situation (optional, max 5MB)
 *               animals:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [dogs, cats, farm animals, wild animals, exotic animals, birds, horses, other]
 *                 minItems: 1
 *                 description: Types of animals involved in the report
 *                 example: ["dogs", "cats"]
 *     responses:
 *       201:
 *         description: Report created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Report created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Report'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation failed"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                         example: "address"
 *                       message:
 *                         type: string
 *                         example: "Either complete address (street and city) or geolocation must be provided"
 *       500:
 *         description: Server error
 */
router.post('/', upload.single('image'), reportController.createReport);

/**
 * @swagger
 * /api/reports/organization:
 *   get:
 *     tags: [Reports]
 *     summary: Get all reports assigned to the user's organization
 *     description: Returns all reports that have been assigned to the current user's organization
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Reports retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Reports retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Report'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get(
  '/organization',
  authenticateJWT,
  reportController.getOrganizationReports
);

/**
 * @swagger
 * /api/reports/{reportId}/mark-viewed:
 *   patch:
 *     tags: [Reports]
 *     summary: Mark a report as viewed by the organization
 *     description: Updates the viewedAt timestamp for the organization assignment. Can only be performed by users from organizations assigned to the report.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the report to mark as viewed
 *     responses:
 *       200:
 *         description: Report marked as viewed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Report marked as viewed successfully"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - organization not assigned to this report
 *       404:
 *         description: Report not found
 *       500:
 *         description: Server error
 */
router.patch(
  '/:reportId/mark-viewed',
  authenticateJWT,
  reportController.markReportAsViewed
);

export default router;
