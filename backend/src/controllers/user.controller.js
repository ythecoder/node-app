import User from '../models/user.model.js';
import Role from '../models/role.model.js';
import Student from '../models/student.model.js';
import Staff from '../models/staff.model.js';
import Parent from '../models/parent.model.js';
import Tenant from '../models/tenant.model.js';

// Get all users (with filters)
export const getAllUsers = async (req, res) => {
  try {
    const { role, status, search } = req.query;
    let tenantId = req.tenantId;
    if (!tenantId || tenantId === 'default-tenant') {
      const tenant = await Tenant.findOne();
      if (tenant) tenantId = tenant._id;
    }

    let query = {};
    if (tenantId) query.tenantId = tenantId;

    if (role) {
      const roleObj = await Role.findOne({ name: role, tenantId });
      if (roleObj) query.role = roleObj._id;
    }

    if (status) {
      query.isActive = status === 'active';
    }

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query)
      .populate('role', 'name permissions')
      .select('-password')
      .limit(100);

    res.json({
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const tenantId = req.tenantId;

    const user = await User.findOne({ _id: id, tenantId })
      .populate('role', 'name permissions')
      .select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user', error: error.message });
  }
};

// Create new user (legacy)
export const createUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, phone, dateOfBirth, gender } = req.body;
    let tenantId = req.tenantId;
    if (!tenantId || tenantId === 'default-tenant') {
      const tenant = await Tenant.findOne();
      if (tenant) tenantId = tenant._id;
    }
    
    let roleId = req.body.roleId;
    if (!roleId) {
      const role = await Role.findOne({ tenantId });
      if (role) roleId = role._id;
    }

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email, tenantId });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Verify role
    const role = await Role.findOne({ _id: roleId, tenantId });
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    const { hashPassword } = await import('../utils/password.utils.js');
    const hashedPassword = await hashPassword(password);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: roleId,
      tenantId,
      phone,
      dateOfBirth,
      gender,
    });

    await user.save();

    const populatedUser = await user.populate('role', 'name permissions');

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: populatedUser._id,
        firstName: populatedUser.firstName,
        lastName: populatedUser.lastName,
        email: populatedUser.email,
        role: populatedUser.role.name,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update user
export const editUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, phone, dateOfBirth, gender, address, roleId, isActive } = req.body;
    const tenantId = req.tenantId;

    const user = await User.findOne({ _id: id, tenantId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify role if changing
    if (roleId && roleId !== user.role.toString()) {
      const role = await Role.findOne({ _id: roleId, tenantId });
      if (!role) {
        return res.status(404).json({ message: 'Role not found' });
      }
      user.role = roleId;
    }

    Object.assign(user, {
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      phone: phone || user.phone,
      dateOfBirth: dateOfBirth || user.dateOfBirth,
      gender: gender || user.gender,
      address: address || user.address,
      isActive: isActive !== undefined ? isActive : user.isActive,
    });

    await user.save();

    const updatedUser = await user.populate('role', 'name permissions');

    res.json({
      message: 'User updated successfully',
      user: {
        id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        role: updatedUser.role.name,
        isActive: updatedUser.isActive,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Delete user
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tenantId = req.tenantId;

    const user = await User.findOne({ _id: id, tenantId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Soft delete
    user.isActive = false;
    await user.save();

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Get activity log
export const getActivityLog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tenantId = req.tenantId;

    const user = await User.findOne({ _id: id, tenantId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      userId: id,
      activityLog: user.activityLog,
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = getAllUsers;

export default {
  getAllUsers,
  getUserById,
  createUser,
  editUser,
  deleteUser,
  getActivityLog,
  getUsers,
};
