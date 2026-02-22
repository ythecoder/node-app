import { body } from 'express-validator';
export const createUserValidator = [
 body('name').notEmpty(),
 body('email').isEmail(),
 body('age').optional().isInt({ min: 1 })
];

export const editUserValidator = [
  body('name').optional().notEmpty(),
  body('email').optional().isEmail(),
  body('age').optional().isInt({ min: 1 })
];

export const deleteUserValidator = [];
