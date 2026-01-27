import express from 'express';
import * as userController from '../controllers/user.controller.js';
import { createUserValidator } from '../validators/user.validator.js';

const router = express.Router();

/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 example: john
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               age:
 *                 type: string
 *                 example: 25
 *     responses:
 *       201:
 *         description: User created successfully
 */
router.post('/', createUserValidator, userController.createUser);

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get all users with pagination
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 5
 *         description: Number of users per page
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 507f1f77bcf86cd799439011
 *                   name:
 *                     type: string
 *                     example: john
 *                   email:
 *                     type: string
 *                     example: john@example.com
 *                   age:
 *                     type: integer
 *                     example: 25
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: 2023-01-01T00:00:00.000Z
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: 2023-01-01T00:00:00.000Z
 *       500:
 *         description: Internal server error
 */
router.get('/', userController.getUsers);

export default router;