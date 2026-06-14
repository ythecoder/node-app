import Staff from '../models/staff.model.js';
import User from '../models/user.model.js';
import Role from '../models/role.model.js';
import Leave from '../models/leave.model.js';
import { hashPassword } from '../utils/password.utils.js';

// Get all staff
export const getAllStaff = async (req, res) => {
  try {
    const { designation, department, employmentStatus, search } = req.query;
    const tenantId = req.tenantId;

    let query = { tenantId };

    if (designation) query.designation = designation;
    if (department) query.department = department;
    if (employmentStatus) query.employmentStatus = employmentStatus;

    if (search) {
      query.$or = [
        { staffId: { $regex: search, $options: 'i' } },
      ];
    }

    const staff = await Staff.find(query)
      .populate('userId', 'firstName lastName email phone')
      .populate('classesAssigned.classId', 'className section')
      .limit(100);

    res.json({
      count: staff.length,
      staff,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch staff', error: error.message });
  }
};

// Get staff by ID
export const getStaffById = async (req, res) => {
  try {
    const { id } = req.params;
    const tenantId = req.tenantId;

    const staff = await Staff.findOne({ _id: id, tenantId })
      .populate('userId')
      .populate('classesAssigned.classId')
      .populate('performanceReviews.reviewedBy', 'firstName lastName');

    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    res.json({ staff });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch staff', error: error.message });
  }
};

// Create new staff with user
export const createStaff = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      staffId,
      designation,
      department,
      joiningDate,
      employmentType,
      phone,
      gender,
      basicSalary,
    } = req.body;
    const tenantId = req.tenantId;

    // Validation
    if (!firstName || !lastName || !email || !password || !staffId || !designation) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if staff ID exists
    const existingStaff = await Staff.findOne({ staffId, tenantId });
    if (existingStaff) {
      return res.status(409).json({ message: 'Staff ID already exists' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email, tenantId });
    if (existingUser) {
      return res.status(409).json({ message: 'A user with this email already exists' });
    }

    // Get role based on designation
    const designationRoleMap = {
      'Principal': 'Principal',
      'Vice Principal': 'Principal',
      'Teacher': 'Teacher',
      'Accountant': 'Accountant',
      'Librarian': 'Librarian',
      'Counselor': 'Counselor',
      'Administrator': 'Admin',
    };
    const roleName = designationRoleMap[designation] || 'Teacher';

    let role = await Role.findOne({ name: roleName, tenantId });

    if (!role) {
      const defaultPermissions = {
        'Principal': ['staff.read', 'staff.create', 'staff.update', 'staff.delete', 'students.read', 'students.create', 'students.update', 'students.delete', 'class.manage', 'academic.manage', 'reports.generate'],
        'Teacher': ['students.read', 'students.update', 'attendance.mark', 'attendance.read', 'class.view', 'leave.request', 'leave.view'],
        'Accountant': ['staff.read', 'students.read', 'fees.collect', 'fees.view', 'fees.report', 'reports.view'],
        'Librarian': ['students.read', 'staff.read', 'class.view'],
        'Counselor': ['students.read', 'staff.read', 'leave.view', 'attendance.view'],
        'Admin': ['all'],
      };

      role = new Role({
        name: roleName,
        permissions: defaultPermissions[roleName] || ['staff.read'],
        tenantId,
        isActive: true,
      });

      await role.save();
    }

    // Create user first
    const hashedPassword = await hashPassword(password);
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      gender,
      role: role._id,
      tenantId,
    });

    await user.save();

    // Create staff record
    const staffRecord = new Staff({
      userId: user._id,
      staffId,
      tenantId,
      designation,
      department,
      joiningDate: joiningDate ? new Date(joiningDate) : new Date(),
      employmentType: ['Permanent', 'Contractual', 'Part-time'].includes(employmentType) ? employmentType : 'Permanent',
      basicSalary,
      employmentStatus: 'Active',
    });

    await staffRecord.save();

    // Link staff to user
    user.staffId = staffRecord._id;
    await user.save();

    res.status(201).json({
      message: 'Staff created successfully',
      staff: {
        id: staffRecord._id,
        staffId: staffRecord.staffId,
        designation: staffRecord.designation,
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Staff creation failed', error: error.message });
  }
};

// Update staff information
export const updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const tenantId = req.tenantId;
    const {
      designation,
      department,
      employmentStatus,
      basicSalary,
      subjectsTeaching,
      qualifications,
    } = req.body;

    const staff = await Staff.findOne({ _id: id, tenantId });
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    Object.assign(staff, {
      designation: designation || staff.designation,
      department: department || staff.department,
      employmentStatus: employmentStatus || staff.employmentStatus,
      basicSalary: basicSalary || staff.basicSalary,
      subjectsTeaching: subjectsTeaching || staff.subjectsTeaching,
    });

    if (qualifications && Array.isArray(qualifications)) {
      staff.qualifications = qualifications;
    }

    await staff.save();

    res.json({
      message: 'Staff updated successfully',
      staff,
    });
  } catch (error) {
    res.status(500).json({ message: 'Staff update failed', error: error.message });
  }
};

// Delete staff
export const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const tenantId = req.tenantId;

    const staff = await Staff.findOneAndDelete({ _id: id, tenantId });
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    if (staff.userId) {
      await User.findByIdAndDelete(staff.userId);
    }

    res.json({ message: 'Staff deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Staff deletion failed', error: error.message });
  }
};

// Assign class to teacher
export const assignClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { classId, section, isClassTeacher } = req.body;
    const tenantId = req.tenantId;

    if (!classId) {
      return res.status(400).json({ message: 'Class ID is required' });
    }

    const staff = await Staff.findOne({ _id: id, tenantId });
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    staff.classesAssigned.push({
      classId,
      section: section || '',
      isClassTeacher: isClassTeacher || false,
    });

    await staff.save();

    res.json({
      message: 'Class assigned successfully',
      staff,
    });
  } catch (error) {
    res.status(500).json({ message: 'Class assignment failed', error: error.message });
  }
};

// Add performance review
export const addPerformanceReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comments } = req.body;
    const tenantId = req.tenantId;

    if (!rating || !comments) {
      return res.status(400).json({ message: 'Rating and comments are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const staff = await Staff.findOne({ _id: id, tenantId });
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    staff.performanceRating = rating;
    staff.performanceReviews.push({
      reviewDate: new Date(),
      rating,
      comments,
      reviewedBy: req.user._id,
    });

    await staff.save();

    res.json({
      message: 'Performance review added successfully',
      staff,
    });
  } catch (error) {
    res.status(500).json({ message: 'Review addition failed', error: error.message });
  }
};

// Get staff leave balance
export const getLeaveBalance = async (req, res) => {
  try {
    const { id } = req.params;
    const tenantId = req.tenantId;

    const staff = await Staff.findOne({ _id: id, tenantId })
      .select('leaveBalance');

    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    res.json({
      staffId: id,
      leaveBalance: staff.leaveBalance,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch leave balance', error: error.message });
  }
};

// Get staff salary information
export const getSalaryInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const tenantId = req.tenantId;

    const staff = await Staff.findOne({ _id: id, tenantId })
      .select('basicSalary salaryStructure bankAccount');

    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    res.json({
      staffId: id,
      salary: {
        basicSalary: staff.basicSalary,
        salaryStructure: staff.salaryStructure,
        bankAccount: staff.bankAccount,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch salary info', error: error.message });
  }
};

// Update salary structure
export const updateSalaryStructure = async (req, res) => {
  try {
    const { id } = req.params;
    const { basicPay, dearness, allowances, deductions, bankAccount } = req.body;
    const tenantId = req.tenantId;

    const staff = await Staff.findOne({ _id: id, tenantId });
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    if (basicPay) staff.basicSalary = basicPay;

    staff.salaryStructure = {
      basicPay: basicPay || staff.salaryStructure.basicPay,
      dearness: dearness || staff.salaryStructure.dearness,
      allowances: allowances || staff.salaryStructure.allowances,
      deductions: deductions || staff.salaryStructure.deductions,
    };

    if (bankAccount) {
      staff.bankAccount = bankAccount;
    }

    await staff.save();

    res.json({
      message: 'Salary structure updated successfully',
      salary: staff.salaryStructure,
    });
  } catch (error) {
    res.status(500).json({ message: 'Salary update failed', error: error.message });
  }
};

export default {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
  assignClass,
  addPerformanceReview,
  getLeaveBalance,
  getSalaryInfo,
  updateSalaryStructure,
};
