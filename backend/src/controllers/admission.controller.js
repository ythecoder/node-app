import Admission from '../models/admission.model.js';

// Submit admission application
export const submitAdmission = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender,
      applyingForClass,
      academicYear,
      previousSchool,
      previousPercentage,
      parentName,
      parentEmail,
      parentPhone,
      parentOccupation,
    } = req.body;
    const tenantId = req.tenantId;

    if (!firstName || !lastName || !email || !applyingForClass || !academicYear) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Generate application number
    const applicationNumber = `APP-${tenantId.substring(0, 4)}-${Date.now()}`;

    const admission = new Admission({
      applicationNumber,
      tenantId,
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender,
      applyingForClass,
      academicYear,
      previousSchool,
      previousPercentage,
      parentName,
      parentEmail,
      parentPhone,
      parentOccupation,
      status: 'Submitted',
    });

    await admission.save();

    res.status(201).json({
      message: 'Admission application submitted successfully',
      applicationNumber: admission.applicationNumber,
      applicationId: admission._id,
    });
  } catch (error) {
    res.status(500).json({ message: 'Admission submission failed', error: error.message });
  }
};

// Get admission applications
export const getAdmissions = async (req, res) => {
  try {
    const { status, search, academicYear } = req.query;
    const tenantId = req.tenantId;

    let query = { tenantId };

    if (status) query.status = status;
    if (academicYear) query.academicYear = academicYear;

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { applicationNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const admissions = await Admission.find(query)
      .populate('reviewedBy', 'firstName lastName email')
      .limit(100);

    res.json({
      count: admissions.length,
      admissions,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch admissions', error: error.message });
  }
};

// Get admission by ID
export const getAdmissionById = async (req, res) => {
  try {
    const { id } = req.params;
    const tenantId = req.tenantId;

    const admission = await Admission.findOne({ _id: id, tenantId })
      .populate('reviewedBy', 'firstName lastName email');

    if (!admission) {
      return res.status(404).json({ message: 'Admission not found' });
    }

    res.json({ admission });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch admission', error: error.message });
  }
};

// Upload admission documents
export const uploadAdmissionDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { documentType, fileUrl } = req.body;
    const tenantId = req.tenantId;

    if (!documentType || !fileUrl) {
      return res.status(400).json({ message: 'Document type and file URL are required' });
    }

    const admission = await Admission.findOne({ _id: id, tenantId });
    if (!admission) {
      return res.status(404).json({ message: 'Admission not found' });
    }

    admission.documents.push({
      documentType,
      fileUrl,
      uploadedAt: new Date(),
    });

    await admission.save();

    res.json({
      message: 'Document uploaded successfully',
      admission,
    });
  } catch (error) {
    res.status(500).json({ message: 'Document upload failed', error: error.message });
  }
};

// Update admission status
export const updateAdmissionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reviewComments, rejectionReason } = req.body;
    const tenantId = req.tenantId;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const admission = await Admission.findOne({ _id: id, tenantId });
    if (!admission) {
      return res.status(404).json({ message: 'Admission not found' });
    }

    admission.status = status;
    admission.reviewedBy = req.user._id;
    admission.reviewDate = new Date();
    admission.reviewComments = reviewComments || '';

    if (status === 'Rejected' && rejectionReason) {
      admission.rejectionReason = rejectionReason;
    }

    if (status === 'Approved') {
      admission.admissionDate = new Date();
    }

    await admission.save();

    res.json({
      message: 'Admission status updated successfully',
      admission,
    });
  } catch (error) {
    res.status(500).json({ message: 'Status update failed', error: error.message });
  }
};

// Schedule interview
export const scheduleInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const { interviewDate } = req.body;
    const tenantId = req.tenantId;

    if (!interviewDate) {
      return res.status(400).json({ message: 'Interview date is required' });
    }

    const admission = await Admission.findOne({ _id: id, tenantId });
    if (!admission) {
      return res.status(404).json({ message: 'Admission not found' });
    }

    admission.status = 'Interview Scheduled';
    admission.interviewScheduledDate = new Date(interviewDate);
    await admission.save();

    res.json({
      message: 'Interview scheduled successfully',
      interviewDate: admission.interviewScheduledDate,
    });
  } catch (error) {
    res.status(500).json({ message: 'Interview scheduling failed', error: error.message });
  }
};

export default {
  submitAdmission,
  getAdmissions,
  getAdmissionById,
  uploadAdmissionDocument,
  updateAdmissionStatus,
  scheduleInterview,
};
