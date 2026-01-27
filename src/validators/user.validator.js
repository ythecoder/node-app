import { body } from 'express-validator';
export const createUserValidator = [
 body('name').notEmpty(),
 body('email').isEmail(),
 body('age').optional().isInt({ min: 1 })
];
