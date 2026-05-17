import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: ["SuperAdmin", "SchoolAdmin", "Principal", "Teacher", "Accountant", "Librarian", "Student", "Parent"],
      required: true,
      unique: true,
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

export default mongoose.model("Role", roleSchema);
