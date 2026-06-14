import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: ["SuperAdmin", "SchoolAdmin", "Admin", "Principal", "Teacher", "Accountant", "Librarian", "Counselor", "Student", "Parent"],
      required: true,
    },
    description: String,
    permissions: [{
      type: String,
      enum: [
        // User Management
        "users.create",
        "users.read",
        "users.update",
        "users.delete",
        // Student Management
        "students.create",
        "students.read",
        "students.update",
        "students.delete",
        "students.enroll",
        "students.promote",
        // Staff Management
        "staff.create",
        "staff.read",
        "staff.update",
        "staff.delete",
        // Attendance
        "attendance.mark",
        "attendance.read",
        "attendance.approve",
        // Fees
        "fees.collect",
        "fees.view",
        "fees.report",
        // Leave
        "leave.request",
        "leave.approve",
        "leave.view",
        // Class Management
        "class.manage",
        "class.view",
        // Academic
        "academic.manage",
        "academic.view",
        // Reports
        "reports.generate",
        "reports.view",
      ],
    }],
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// Compound unique index on name and tenantId
roleSchema.index({ name: 1, tenantId: 1 }, { unique: true });

export default mongoose.model("Role", roleSchema);
