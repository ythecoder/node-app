import express from 'express';
import { checkDBHealth } from '../controllers/health.controller.js';

const router = express.Router();

/**
 * @swagger
 * /api/v1/health/db:
 *   get:
 *     summary: Check database connection health
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Database connection status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [ok, connecting]
 *                   example: ok
 *                 message:
 *                   type: string
 *                   example: Database connected ✅
 *       500:
 *         description: Database connection error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Database not connected ❌
 */
router.get('/db', checkDBHealth);

export default router;