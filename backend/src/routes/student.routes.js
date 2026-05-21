import express from 'express';
import * as studentController from '../controllers/student.controller.js';
import * as admissionController from '../controllers/admission.controller.js';
import { auth, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

// ===== STUDENT ROUTES =====

/**
 * @swagger
 * /api/v1/students:
 *   get:
 *     summary: Get all students
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: classId
 *         schema: { type: string }
 *       - in: query
 *         name: enrollmentStatus
 *         schema: { type: string }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200: { description: List of students }
 */
router.get('/', auth, studentController.getAllStudents);

/**
 * @swagger
 * /api/v1/students/{id}:
 *   get:
 *     summary: Get student by ID
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Student details }
 */
router.get('/:id', auth, studentController.getStudentById);

/**
 * @swagger
 * /api/v1/students:
 *   post:
 *     summary: Create new student
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstName, lastName, email, password, enrollmentNumber, currentClass, academicYear]
 *             properties:
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *               enrollmentNumber: { type: string }
 *               currentClass: { type: string }
 *               academicYear: { type: string }
 *     responses:
 *       201: { description: Student created successfully }
 */
router.post('/', auth, authorize(['students.create']), studentController.createStudent);

/**
 * @swagger
 * /api/v1/students/{id}:
 *   put:
 *     summary: Update student
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Student updated successfully }
 */
router.put('/:id', auth, authorize(['students.update']), studentController.updateStudent);

/**
 * @swagger
 * /api/v1/students/{id}:
 *   delete:
 *     summary: Delete student
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Student deleted successfully }
 */
router.delete('/:id', auth, authorize(['students.delete']), studentController.deleteStudent);

/**
 * @swagger
 * /api/v1/students/{id}/promote:
 *   post:
 *     summary: Promote student to next class
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Student promoted successfully }
 */
router.post('/:id/promote', auth, authorize(['students.promote']), studentController.promoteStudent);

/**
 * @swagger
 * /api/v1/students/{id}/parent:
 *   post:
 *     summary: Add parent/guardian to student
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Parent added successfully }
 */
router.post('/:id/parent', auth, studentController.addParentToStudent);

/**
 * @swagger
 * /api/v1/students/{id}/document:
 *   post:
 *     summary: Upload student document
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Document uploaded successfully }
 */
router.post('/:id/document', auth, studentController.uploadDocument);

/**
 * @swagger
 * /api/v1/students/{id}/performance:
 *   get:
 *     summary: Get student performance
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Student performance data }
 */
router.get('/:id/performance', auth, studentController.getStudentPerformance);

// ===== ADMISSION ROUTES =====

/**
 * @swagger
 * /api/v1/admissions/apply:
 *   post:
 *     summary: Submit admission application
 *     tags: [Admissions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstName, lastName, email, applyingForClass, academicYear]
 *             properties:
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               email: { type: string }
 *               applyingForClass: { type: number }
 *               academicYear: { type: string }
 *     responses:
 *       201: { description: Application submitted successfully }
 */
router.post('/apply', admissionController.submitAdmission);

/**
 * @swagger
 * /api/v1/admissions:
 *   get:
 *     summary: Get all admission applications
 *     tags: [Admissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *       - in: query
 *         name: academicYear
 *         schema: { type: string }
 *     responses:
 *       200: { description: List of applications }
 */
router.get('/', auth, admissionController.getAdmissions);

/**
 * @swagger
 * /api/v1/admissions/{id}:
 *   get:
 *     summary: Get admission by ID
 *     tags: [Admissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Application details }
 */
router.get('/:id', auth, admissionController.getAdmissionById);

/**
 * @swagger
 * /api/v1/admissions/{id}/document:
 *   post:
 *     summary: Upload admission document
 *     tags: [Admissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Document uploaded successfully }
 */
router.post('/:id/document', auth, admissionController.uploadAdmissionDocument);

/**
 * @swagger
 * /api/v1/admissions/{id}/status:
 *   put:
 *     summary: Update admission status
 *     tags: [Admissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Status updated successfully }
 */
router.put('/:id/status', auth, authorize(['students.enroll']), admissionController.updateAdmissionStatus);

/**
 * @swagger
 * /api/v1/admissions/{id}/interview:
 *   post:
 *     summary: Schedule interview
 *     tags: [Admissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Interview scheduled successfully }
 */
router.post('/:id/interview', auth, authorize(['students.enroll']), admissionController.scheduleInterview);

export default router;
