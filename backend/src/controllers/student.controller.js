import Student from '../models/student.model.js';
import User from '../models/user.model.js';
import Role from '../models/role.model.js';
import { hashPassword } from '../utils/password.utils.js';

// Get all students
export const getAllStudents = async (req, res) => {
  try {
    const { classId, enrollmentStatus, search } = req.query;
    const tenantId = req.tenantId;

    let query = { tenantId };

    if (classId) query.currentClass = classId;
    if (enrollmentStatus) query.enrollmentStatus = enrollmentStatus;

    if (search) {
      query.$or = [
        { enrollmentNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const students = await Student.find(query)
      .populate('userId', 'firstName lastName email phone')
      .populate('currentClass', 'className section')
      .populate('parents.parentId')
      .limit(100);

    res.json({
      count: students.length,
      students,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch students', error: error.message });
  }
};

// Get student by ID
export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const tenantId = req.tenantId;

    const student = await Student.findOne({ _id: id, tenantId })
      .populate('userId')
      .populate('currentClass')
      .populate('parents.parentId');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ student });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch student', error: error.message });
  }
};

// Create new student with user
export const createStudent = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      enrollmentNumber,
      dateOfBirth,
      gender,
      currentClass,
      currentSection,
      academicYear,
      emergencyContact,
    } = req.body;
    const tenantId = req.tenantId;

    // Validation
    if (!firstName || !lastName || !email || !password || !enrollmentNumber) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if student enrollment number exists
    const existingStudent = await Student.findOne({ enrollmentNumber, tenantId });
    if (existingStudent) {
      return res.status(409).json({ message: 'Enrollment number already exists' });
    }

    // Get student role
    const studentRole = await Role.findOne({ name: 'Student', tenantId });
    if (!studentRole) {
      return res.status(404).json({ message: 'Student role not found' });
    }

    // Create user first
    const hashedPassword = await hashPassword(password);
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      gender,
      dateOfBirth,
      role: studentRole._id,
      tenantId,
    });

    await user.save();

    // Create student record
    const student = new Student({
      userId: user._id,
      enrollmentNumber,
      tenantId,
      dateOfBirth,
      gender,
      currentClass,
      currentSection,
      academicYear,
      emergencyContact,
      admissionDate: new Date(),
      enrollmentStatus: 'Active',
    });

    await student.save();

    // Link student to user
    user.studentId = student._id;
    await user.save();

    const populatedStudent = await student.populate('userId');

    res.status(201).json({
      message: 'Student created successfully',
      student: {
        id: student._id,
        enrollmentNumber: student.enrollmentNumber,
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Student creation failed', error: error.message });
  }
};

// Update student
export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const tenantId = req.tenantId;
    const {
      currentClass,
      currentSection,
      academicYear,
      emergencyContact,
      medicalHistory,
      allergies,
      disciplinaryRecord,
    } = req.body;

    const student = await Student.findOne({ _id: id, tenantId });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    Object.assign(student, {
      currentClass: currentClass || student.currentClass,
      currentSection: currentSection || student.currentSection,
      academicYear: academicYear || student.academicYear,
      emergencyContact: emergencyContact || student.emergencyContact,
      medicalHistory: medicalHistory || student.medicalHistory,
      allergies: allergies || student.allergies,
    });

    if (disciplinaryRecord) {
      student.disciplinaryRecord.push(disciplinaryRecord);
    }

    await student.save();

    res.json({
      message: 'Student updated successfully',
      student,
    });
  } catch (error) {
    res.status(500).json({ message: 'Student update failed', error: error.message });
  }
};

// Add parent/guardian to student
export const addParentToStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { parentId, relationship } = req.body;
    const tenantId = req.tenantId;

    if (!parentId || !relationship) {
      return res.status(400).json({ message: 'Parent ID and relationship are required' });
    }

    const student = await Student.findOne({ _id: id, tenantId });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    student.parents.push({ parentId, relationship, isPrimaryContact: false });
    await student.save();

    res.json({
      message: 'Parent added successfully',
      student,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add parent', error: error.message });
  }
};

// Upload document
export const uploadDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { documentType, documentNumber, fileUrl } = req.body;
    const tenantId = req.tenantId;

    if (!documentType || !fileUrl) {
      return res.status(400).json({ message: 'Document type and file URL are required' });
    }

    const student = await Student.findOne({ _id: id, tenantId });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const document = {
      documentType,
      documentNumber,
      fileUrl,
      uploadedAt: new Date(),
      version: 1,
    };

    // Check if document type already exists and increment version
    const existingDoc = student.documents.find(d => d.documentType === documentType);
    if (existingDoc) {
      document.version = (existingDoc.version || 1) + 1;
    }

    student.documents.push(document);
    await student.save();

    res.json({
      message: 'Document uploaded successfully',
      document,
    });
  } catch (error) {
    res.status(500).json({ message: 'Document upload failed', error: error.message });
  }
};

// Promote student to next class
export const promoteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { newClass, newSection, newAcademicYear } = req.body;
    const tenantId = req.tenantId;

    if (!newClass || !newAcademicYear) {
      return res.status(400).json({ message: 'New class and academic year are required' });
    }

    const student = await Student.findOne({ _id: id, tenantId });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Store previous class info
    student.previousClass = student.currentClass?.toString();
    student.previousSection = student.currentSection;

    // Update current class
    student.currentClass = newClass;
    student.currentSection = newSection || student.currentSection;
    student.academicYear = newAcademicYear;

    await student.save();

    res.json({
      message: 'Student promoted successfully',
      student,
    });
  } catch (error) {
    res.status(500).json({ message: 'Student promotion failed', error: error.message });
  }
};

// Get student performance
export const getStudentPerformance = async (req, res) => {
  try {
    const { id } = req.params;
    const tenantId = req.tenantId;

    const student = await Student.findOne({ _id: id, tenantId })
      .select('cgpa gpa totalMarks academicYear currentClass');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({
      studentId: id,
      performance: {
        cgpa: student.cgpa,
        gpa: student.gpa,
        totalMarks: student.totalMarks,
        academicYear: student.academicYear,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch performance', error: error.message });
  }
};

export default {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  addParentToStudent,
  uploadDocument,
  promoteStudent,
  getStudentPerformance,
};
