import Leave from '../models/leave.model.js';
import Staff from '../models/staff.model.js';

// Request leave
export const requestLeave = async (req, res) => {
  try {
    const {
      staffId,
      leaveType,
      startDate,
      endDate,
      reason,
      documentUrl,
    } = req.body;
    const tenantId = req.tenantId;

    if (!staffId || !leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    // Calculate number of days
    const numberOfDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    const leave = new Leave({
      staffId,
      tenantId,
      leaveType,
      startDate: start,
      endDate: end,
      numberOfDays,
      reason,
      documentUrl,
      status: 'Pending',
    });

    await leave.save();

    res.status(201).json({
      message: 'Leave request submitted successfully',
      leave,
    });
  } catch (error) {
    res.status(500).json({ message: 'Leave request failed', error: error.message });
  }
};

// Get staff leaves
export const getLeaves = async (req, res) => {
  try {
    const { staffId, status, month } = req.query;
    const tenantId = req.tenantId;

    let query = { tenantId };

    if (staffId) query.staffId = staffId;
    if (status) query.status = status;

    if (month) {
      const year = new Date().getFullYear();
      const monthNum = parseInt(month);
      const startDate = new Date(year, monthNum - 1, 1);
      const endDate = new Date(year, monthNum, 0);

      query.startDate = { $gte: startDate, $lte: endDate };
    }

    const leaves = await Leave.find(query)
      .populate('staffId', 'staffId userId')
      .populate('staffId.userId', 'firstName lastName')
      .populate('approvedBy', 'firstName lastName')
      .limit(100);

    res.json({
      count: leaves.length,
      leaves,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch leaves', error: error.message });
  }
};

// Get leave by ID
export const getLeaveById = async (req, res) => {
  try {
    const { id } = req.params;
    const tenantId = req.tenantId;

    const leave = await Leave.findOne({ _id: id, tenantId })
      .populate('staffId', 'staffId userId')
      .populate('approvedBy', 'firstName lastName');

    if (!leave) {
      return res.status(404).json({ message: 'Leave not found' });
    }

    res.json({ leave });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch leave', error: error.message });
  }
};

// Approve leave
export const approveLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { comments } = req.body;
    const tenantId = req.tenantId;

    const leave = await Leave.findOne({ _id: id, tenantId });
    if (!leave) {
      return res.status(404).json({ message: 'Leave not found' });
    }

    if (leave.status !== 'Pending') {
      return res.status(400).json({ message: 'Leave is already processed' });
    }

    // Check leave balance
    const staff = await Staff.findById(leave.staffId);
    const leaveTypeKey = leave.leaveType.toLowerCase();
    const key = leaveTypeKey === 'casual' ? 'casual' : 
                 leaveTypeKey === 'sick' ? 'sick' :
                 leaveTypeKey === 'earned' ? 'earned' :
                 leaveTypeKey === 'maternity' ? 'maternity' :
                 leaveTypeKey === 'paternity' ? 'paternity' : 'other';

    if (staff.leaveBalance[key] < leave.numberOfDays) {
      return res.status(400).json({
        message: 'Insufficient leave balance',
        required: leave.numberOfDays,
        available: staff.leaveBalance[key],
      });
    }

    // Update leave status
    leave.status = 'Approved';
    leave.approvedBy = req.user._id;
    leave.approvalDate = new Date();
    leave.approvalComments = comments || '';

    // Deduct from balance
    staff.leaveBalance[key] -= leave.numberOfDays;
    await staff.save();
    await leave.save();

    res.json({
      message: 'Leave approved successfully',
      leave,
    });
  } catch (error) {
    res.status(500).json({ message: 'Leave approval failed', error: error.message });
  }
};

// Reject leave
export const rejectLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { comments } = req.body;
    const tenantId = req.tenantId;

    const leave = await Leave.findOne({ _id: id, tenantId });
    if (!leave) {
      return res.status(404).json({ message: 'Leave not found' });
    }

    if (leave.status !== 'Pending') {
      return res.status(400).json({ message: 'Leave is already processed' });
    }

    leave.status = 'Rejected';
    leave.approvedBy = req.user._id;
    leave.approvalDate = new Date();
    leave.approvalComments = comments || '';

    await leave.save();

    res.json({
      message: 'Leave rejected',
      leave,
    });
  } catch (error) {
    res.status(500).json({ message: 'Leave rejection failed', error: error.message });
  }
};

// Cancel leave
export const cancelLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const tenantId = req.tenantId;

    const leave = await Leave.findOne({ _id: id, tenantId });
    if (!leave) {
      return res.status(404).json({ message: 'Leave not found' });
    }

    if (leave.status === 'Cancelled') {
      return res.status(400).json({ message: 'Leave is already cancelled' });
    }

    // Refund leave balance if approved
    if (leave.status === 'Approved') {
      const staff = await Staff.findById(leave.staffId);
      const leaveTypeKey = leave.leaveType.toLowerCase();
      const key = leaveTypeKey === 'casual' ? 'casual' : 
                   leaveTypeKey === 'sick' ? 'sick' :
                   leaveTypeKey === 'earned' ? 'earned' :
                   leaveTypeKey === 'maternity' ? 'maternity' :
                   leaveTypeKey === 'paternity' ? 'paternity' : 'other';

      staff.leaveBalance[key] += leave.numberOfDays;
      await staff.save();
    }

    leave.status = 'Cancelled';
    await leave.save();

    res.json({
      message: 'Leave cancelled successfully',
      leave,
    });
  } catch (error) {
    res.status(500).json({ message: 'Leave cancellation failed', error: error.message });
  }
};

export default {
  requestLeave,
  getLeaves,
  getLeaveById,
  approveLeave,
  rejectLeave,
  cancelLeave,
};
