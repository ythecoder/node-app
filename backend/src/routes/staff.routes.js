import express from 'express';
import * as staffController from '../controllers/staff.controller.js';
import * as leaveController from '../controllers/leave.controller.js';
import { auth, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

// ===== STAFF ROUTES =====

/**
 * @swagger
 * /api/v1/staff:
 *   get:
 *     summary: Get all staff
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: designation
 *         schema: { type: string }
 *       - in: query
 *         name: department
 *         schema: { type: string }
 *     responses:
 *       200: { description: List of staff }
 */
router.get('/', auth, staffController.getAllStaff);

/**
 * @swagger
 * /api/v1/staff/{id}:
 *   get:
 *     summary: Get staff by ID
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Staff details }
 */
router.get('/:id', auth, staffController.getStaffById);

/**
 * @swagger
 * /api/v1/staff:
 *   post:
 *     summary: Create new staff
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstName, lastName, email, password, staffId, designation]
 *     responses:
 *       201: { description: Staff created successfully }
 */
router.post('/', auth, authorize(['staff.create']), staffController.createStaff);

/**
 * @swagger
 * /api/v1/staff/{id}:
 *   put:
 *     summary: Update staff information
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Staff updated successfully }
 */
router.put('/:id', auth, authorize(['staff.update']), staffController.updateStaff);

/**
 * @swagger
 * /api/v1/staff/{id}:
 *   delete:
 *     summary: Delete staff
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Staff deleted successfully }
 */
router.delete('/:id', auth, authorize(['staff.delete']), staffController.deleteStaff);

/**
 * @swagger
 * /api/v1/staff/{id}/class:
 *   post:
 *     summary: Assign class to staff
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Class assigned successfully }
 */
router.post('/:id/class', auth, authorize(['staff.update']), staffController.assignClass);

/**
 * @swagger
 * /api/v1/staff/{id}/review:
 *   post:
 *     summary: Add performance review
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Review added successfully }
 */
router.post('/:id/review', auth, authorize(['staff.update']), staffController.addPerformanceReview);

/**
 * @swagger
 * /api/v1/staff/{id}/leave-balance:
 *   get:
 *     summary: Get staff leave balance
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Leave balance }
 */
router.get('/:id/leave-balance', auth, staffController.getLeaveBalance);

/**
 * @swagger
 * /api/v1/staff/{id}/salary:
 *   get:
 *     summary: Get staff salary information
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Salary information }
 */
router.get('/:id/salary', auth, authorize(['staff.read']), staffController.getSalaryInfo);

/**
 * @swagger
 * /api/v1/staff/{id}/salary:
 *   put:
 *     summary: Update staff salary structure
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Salary updated successfully }
 */
router.put('/:id/salary', auth, authorize(['staff.update']), staffController.updateSalaryStructure);

// ===== LEAVE ROUTES =====

/**
 * @swagger
 * /api/v1/leaves:
 *   post:
 *     summary: Request leave
 *     tags: [Leaves]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [staffId, leaveType, startDate, endDate, reason]
 *     responses:
 *       201: { description: Leave requested successfully }
 */
router.post('/', auth, authorize(['leave.request']), leaveController.requestLeave);

/**
 * @swagger
 * /api/v1/leaves:
 *   get:
 *     summary: Get leaves
 *     tags: [Leaves]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: staffId
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *     responses:
 *       200: { description: List of leaves }
 */
router.get('/', auth, leaveController.getLeaves);

/**
 * @swagger
 * /api/v1/leaves/{id}:
 *   get:
 *     summary: Get leave by ID
 *     tags: [Leaves]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Leave details }
 */
router.get('/:id', auth, leaveController.getLeaveById);

/**
 * @swagger
 * /api/v1/leaves/{id}/approve:
 *   post:
 *     summary: Approve leave
 *     tags: [Leaves]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Leave approved }
 */
router.post('/:id/approve', auth, authorize(['leave.approve']), leaveController.approveLeave);

/**
 * @swagger
 * /api/v1/leaves/{id}/reject:
 *   post:
 *     summary: Reject leave
 *     tags: [Leaves]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Leave rejected }
 */
router.post('/:id/reject', auth, authorize(['leave.approve']), leaveController.rejectLeave);

/**
 * @swagger
 * /api/v1/leaves/{id}/cancel:
 *   post:
 *     summary: Cancel leave
 *     tags: [Leaves]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Leave cancelled }
 */
router.post('/:id/cancel', auth, leaveController.cancelLeave);

export default router;
