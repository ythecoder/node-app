import User from '../models/user.model.js';
import Role from '../models/role.model.js';
import Tenant from '../models/tenant.model.js';
import { hashPassword, comparePassword, generateResetToken, validatePassword } from '../utils/password.utils.js';
import { generateToken } from '../middlewares/auth.middleware.js';

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validate input
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters long',
      });
    }

    // Verify tenant exists
    const tenant = await Tenant.findOne();
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }
    const tenantId = tenant._id;

    // Check if user exists
    const existingUser = await User.findOne({ email, tenantId });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists with this email' });
    }

    // Verify role exists and belongs to tenant
    const role = await Role.findOne({ tenantId });
    if (!role) {
      return res.status(404).json({ message: 'Role not found or invalid' });
    }
    const roleId = role._id;

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      tenantId,
      role: roleId,
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id, tenantId);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: role.name,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user with tenant
    const user = await User.findOne({ email }).select('+password').populate('role');

    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid credentials or user inactive' });
    }

    // Check password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      user.loginAttempts = (user.loginAttempts || 0) + 1;
      if (user.loginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // Lock for 30 minutes
      }
      await user.save();
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is locked
    if (user.lockUntil && user.lockUntil > new Date()) {
      return res.status(403).json({ message: 'Account locked. Try again later' });
    }

    // Reset login attempts
    user.loginAttempts = 0;
    user.lockUntil = null;
    user.lastLogin = new Date();

    // Log activity
    user.activityLog.push({
      action: 'LOGIN',
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id, user.tenantId);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role.name,
        permissions: user.role.permissions,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('role');

    res.json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role.name,
        permissions: user.role.permissions,
        tenantId: user.tenantId,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user', error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, dateOfBirth, gender, address, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        firstName: firstName || req.user.firstName,
        lastName: lastName || req.user.lastName,
        phone: phone || req.user.phone,
        dateOfBirth: dateOfBirth || req.user.dateOfBirth,
        gender: gender || req.user.gender,
        address: address || req.user.address,
        avatar: avatar || req.user.avatar,
      },
      { new: true }
    ).populate('role');

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role.name,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Profile update failed', error: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'All password fields are required' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    if (!validatePassword(newPassword)) {
      return res.status(400).json({
        message: 'New password must be at least 6 characters long',
      });
    }

    const user = await User.findById(req.user._id).select('+password');

    const isOldPasswordValid = await comparePassword(oldPassword, user.password);
    if (!isOldPasswordValid) {
      return res.status(401).json({ message: 'Old password is incorrect' });
    }

    const hashedNewPassword = await hashPassword(newPassword);
    user.password = hashedNewPassword;
    user.passwordChangedAt = new Date();

    user.activityLog.push({
      action: 'PASSWORD_CHANGED',
      ipAddress: req.ip,
    });

    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Password change failed', error: error.message });
  }
};

export default {
  register,
  login,
  getCurrentUser,
  updateProfile,
  changePassword,
};
