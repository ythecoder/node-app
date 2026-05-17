import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Present", "Absent", "Leave", "Late"],
      required: true,
    },
    remarks: String,
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    periodNumber: Number, // For single period attendance
    isApproved: { type: Boolean, default: false },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

// Indexes
attendanceSchema.index({ studentId: 1, date: 1, tenantId: 1 });
attendanceSchema.index({ staffId: 1, date: 1, tenantId: 1 });
attendanceSchema.index({ classId: 1, date: 1, tenantId: 1 });
attendanceSchema.index({ date: 1, tenantId: 1 });

export default mongoose.model("Attendance", attendanceSchema);
