import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
  {
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      required: true,
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
    leaveType: {
      type: String,
      enum: ["Casual", "Sick", "Earned", "Maternity", "Paternity", "Other"],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    numberOfDays: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    documentUrl: String,
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Cancelled"],
      default: "Pending",
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    approvalDate: Date,
    approvalComments: String,
  },
  { timestamps: true },
);

// Indexes
leaveSchema.index({ staffId: 1, tenantId: 1 });
leaveSchema.index({ status: 1, tenantId: 1 });
leaveSchema.index({ startDate: 1, endDate: 1 });

export default mongoose.model("Leave", leaveSchema);
