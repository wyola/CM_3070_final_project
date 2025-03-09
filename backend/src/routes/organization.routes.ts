import { Router } from 'express';
import multer from 'multer';
import { OrganizationController } from '../controllers/organization.controller';
import needRoutes from './need.routes';

const router = Router();
const organizationController = new OrganizationController();

const storage = multer.diskStorage({
  destination: './uploads/logos',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage });

/**
 * @swagger
 * components:
 *   schemas:
 *     Organization:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - krs
 *         - email
 *         - phone
 *         - city
 *         - postalCode
 *         - address
 *         - voivodeship
 *         - logo
 *         - acceptsReports
 *         - animals
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         krs:
 *           type: string
 *         phone:
 *           type: string
 *         city:
 *           type: string
 *         postalCode:
 *           type: string
 *           description: Format XX-XXX where X is a digit
 *           example: "00-001"
 *         voivodeship:
 *           type: string
 *           example: "MAZOWIECKIE"
 *         address:
 *           type: string
 *         geolocation:
 *           type: object
 *           nullable: true
 *           properties:
 *             lat:
 *               type: number
 *               description: Latitude coordinate
 *             lon:
 *               type: number
 *               description: Longitude coordinate
 *         logo:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         website:
 *           type: string
 *           nullable: true
 *         acceptsReports:
 *           type: boolean
 *         animals:
 *           type: array
 *           items:
 *             type: string
 *             enum: [dogs, cats, farm animals, wild animals, exotic animals, birds, horses, other]
 *           description: Types of animals the organization handles
 */

/**
 * @swagger
 * /api/organizations:
 *   post:
 *     tags: [Organizations]
 *     summary: Register a new organization
 *     description: Register a new organization. The voivodeship field will be automatically filled based on the KRS number from the whitelist.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - krs
 *               - email
 *               - password
 *               - phone
 *               - city
 *               - postalCode
 *               - address
 *               - logo
 *               - voivodeship
 *               - animals
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 description: Organization name
 *                 example: ""
 *               krs:
 *                 type: string
 *                 pattern: '^[0-9]{10}$'
 *                 description: Must be whitelisted in the system. The voivodeship will be determined from this KRS.
 *                 example: ""
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ""
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: ""
 *               phone:
 *                 type: string
 *                 pattern: '^\+?[0-9\s-]{9,}$'
 *                 description: Phone number
 *                 example: ""
 *               city:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: ""
 *               postalCode:
 *                 type: string
 *                 pattern: '^[0-9]{2}-[0-9]{3}$'
 *                 description: Postal code in format XX-XXX where X is a digit
 *                 example: ""
 *               address:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 200
 *                 description: Street address
 *                 example: ""
 *               voivodeship:
 *                 type: string
 *                 description: Voivodeship name
 *                 example: "mazowieckie"
 *               logo:
 *                 type: string
 *                 format: binary
 *                 example: ""
 *               description:
 *                 type: string
 *                 description: Organization description
 *                 example: ""
 *               website:
 *                 type: string
 *                 format: uri
 *                 description: Organization website URL
 *                 example: ""
 *               acceptsReports:
 *                 type: boolean
 *                 description: Whether organization accepts abuse reports
 *                 default: false
 *               animals:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [dogs, cats, farm animals, wild animals, exotic animals, birds, horses, other]
 *                 minItems: 1
 *                 description: Types of animals the organization handles
 *                 example: ["dogs", "cats"]
 *     responses:
 *       201:
 *         description: Organization registered successfully. The voivodeship field in the response will be automatically filled based on the KRS.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Organization registered successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     organization:
 *                       $ref: '#/components/schemas/Organization'
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         email:
 *                           type: string
 *       400:
 *         description: Validation error or missing logo
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Logo is required"
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Validation failed"
 *                     errors:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           field:
 *                             type: string
 *                             example: "email"
 *                           message:
 *                             type: string
 *                             example: "Invalid email address"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *   get:
 *     summary: Get organizations with pagination and optional filters
 *     tags: [Organizations]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search organizations by name or city (case insensitive, partial match)
 *       - in: query
 *         name: voivodeship
 *         schema:
 *           type: string
 *         description: Filter organizations by voivodeship (case insensitive, exact match)
 *       - in: query
 *         name: acceptsReports
 *         schema:
 *           type: boolean
 *         description: Filter organizations by whether they accept reports (true/false)
 *       - in: query
 *         name: animals
 *         schema:
 *           type: string
 *         description: Filter organizations by animal types (comma-separated values, e.g. 'dogs,cats')
 *         example: "dogs,cats"
 *     responses:
 *       200:
 *         description: Organizations retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Organizations retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     organizations:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Organization'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                           description: Total number of organizations
 *                         page:
 *                           type: integer
 *                           description: Current page
 *                         limit:
 *                           type: integer
 *                           description: Items per page
 *                         pages:
 *                           type: integer
 *                           description: Total number of pages
 *       400:
 *         description: Invalid query parameters
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/organizations/{id}:
 *   get:
 *     summary: Get organization by ID
 *     tags: [Organizations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Organization ID
 *     responses:
 *       200:
 *         description: Organization retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Organization retrieved successfully"
 *                 organization:
 *                   $ref: '#/components/schemas/Organization'
 *       404:
 *         description: Organization not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Organization not found"
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/organizations/krs/{krs}:
 *   get:
 *     summary: Get organization information by KRS number
 *     tags: [Organizations]
 *     parameters:
 *       - in: path
 *         name: krs
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9]{10}$'
 *         description: KRS number (10 digits)
 *     responses:
 *       200:
 *         description: Organization information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Organization information retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Organization Name"
 *                     voivodeship:
 *                       type: string
 *                       example: "MAZOWIECKIE"
 *                     city:
 *                       type: string
 *                       example: "Warszawa"
 *       404:
 *         description: Organization not found in whitelist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Organization with this KRS not found in whitelist"
 *       400:
 *         description: Invalid KRS format or Organization is already registered
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Invalid KRS format. Must be 10 digits."
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Organization with this KRS is already registered"
 *       500:
 *         description: Server error
 */

router.post('/', upload.single('logo'), organizationController.register);
router.get('/', organizationController.getOrganizations);
router.get('/:id', organizationController.getOrganizationById);
router.get('/krs/:krs', organizationController.getOrganizationByKrs);

router.use('/:organizationId/needs', needRoutes);

export default router;
