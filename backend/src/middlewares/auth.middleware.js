import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import Role from '../models/role.model.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

export const generateToken = (userId, tenantId) => {
  return jwt.sign(
    { userId, tenantId },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    const user = await User.findById(decoded.userId).populate('role');

    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'User not found or inactive' });
    }

    req.user = user;
    req.tenantId = decoded.tenantId;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Authentication error', error: error.message });
  }
};

export const authorize = (requiredPermissions = []) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const role = req.user.role;

      // SuperAdmin bypass
      if (role.name === 'SuperAdmin') {
        return next();
      }

      const hasPermission = requiredPermissions.every((permission) =>
        role.permissions.includes(permission)
      );

      if (!hasPermission) {
        return res.status(403).json({
          message: 'Insufficient permissions',
          required: requiredPermissions,
          available: role.permissions,
        });
      }

      next();
    } catch (error) {
      res.status(500).json({ message: 'Authorization error', error: error.message });
    }
  };
};

// Check single permission
export const checkPermission = (permission) => {
  return authorize([permission]);
};

export default { auth, authorize, checkPermission, generateToken, verifyToken };
