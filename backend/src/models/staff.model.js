import mongoose from "mongoose";

const staffSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    staffId: {
      type: String,
      required: true,
      unique: true,
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
    
    // Employment Information
    designation: {
      type: String,
      enum: ["Principal", "Vice Principal", "Teacher", "Accountant", "Librarian", "Counselor", "Administrator"],
      required: true,
    },
    department: String,
    joiningDate: { type: Date, required: true },
    employmentType: {
      type: String,
      enum: ["Permanent", "Contractual", "Part-time"],
      default: "Permanent",
    },
    
    // Qualifications
    qualifications: [{
      degree: String,
      field: String,
      institution: String,
      yearOfCompletion: Number,
      certificate: String,
    }],
    
    // Subject & Class Assignment
    subjectsTeaching: [String],
    classesAssigned: [{
      classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
      },
      section: String,
      isClassTeacher: Boolean,
    }],
    
    // Professional Experience
    totalExperience: Number, // in years
    previousWorkExperience: [{
      designation: String,
      institution: String,
      startDate: Date,
      endDate: Date,
      reasonForLeaving: String,
    }],
    
    // Salary Information
    basicSalary: Number,
    salaryStructure: {
      basicPay: Number,
      dearness: Number,
      allowances: mongoose.Schema.Types.Mixed,
      deductions: mongoose.Schema.Types.Mixed,
    },
    bankAccount: {
      accountNumber: String,
      bankName: String,
      ifscCode: String,
      accountHolderName: String,
    },
    
    // Leave Balance
    leaveBalance: {
      casual: { type: Number, default: 12 },
      sick: { type: Number, default: 10 },
      earned: { type: Number, default: 20 },
      maternity: { type: Number, default: 0 },
      paternity: { type: Number, default: 0 },
      other: { type: Number, default: 0 },
    },
    
    // Performance Metrics
    performanceRating: Number,
    performanceReviews: [{
      reviewDate: Date,
      rating: Number,
      comments: String,
      reviewedBy: String,
    }],
    
    // Status
    employmentStatus: {
      type: String,
      enum: ["Active", "On Leave", "Inactive", "Retired", "Terminated"],
      default: "Active",
    },
    
    researchPapers: [String],
    awards: [String],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// Indexes
staffSchema.index({ staffId: 1, tenantId: 1 });
staffSchema.index({ userId: 1, tenantId: 1 });
staffSchema.index({ designation: 1, tenantId: 1 });
staffSchema.index({ tenantId: 1 });

export default mongoose.model("Staff", staffSchema);
