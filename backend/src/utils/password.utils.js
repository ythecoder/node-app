import bcrypt from 'bcrypt';
import crypto from 'crypto';

const SALT_ROUNDS = 10;

export const hashPassword = async (password) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

export const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const validatePassword = (password) => {
  // At least 6 characters
  return password.length >= 6;
};

export default {
  hashPassword,
  comparePassword,
  generateResetToken,
  generateOTP,
  validatePassword,
};
