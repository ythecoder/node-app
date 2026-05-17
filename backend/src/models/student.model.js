import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    enrollmentNumber: {
      type: String,
      required: true,
      unique: true,
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
    // Personal Information
    dateOfBirth: Date,
    placeOfBirth: String,
    nationality: String,
    caste: String,
    religion: String,
    bloodGroup: String,
    
    // Academic Information
    admissionDate: { type: Date, default: Date.now },
    currentClass: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },
    currentSection: String,
    academicYear: String,
    previousClass: String,
    previousSection: String,
    
    // Medical Information
    medicalHistory: String,
    allergies: [String],
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String,
    },
    
    // Parents/Guardians
    parents: [{
      parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Parent",
      },
      relationship: String,
      isPrimaryContact: Boolean,
    }],
    
    // Documents
    documents: [{
      documentType: {
        type: String,
        enum: ["Aadhaar", "Birth Certificate", "10th Certificate", "Transfer Certificate"],
      },
      documentNumber: String,
      fileUrl: String,
      uploadedAt: Date,
      version: Number,
    }],
    
    // Academic Performance
    cgpa: Number,
    gpa: Number,
    totalMarks: Number,
    
    // Disciplinary Record
    disciplinaryRecord: [{
      date: Date,
      incidentDescription: String,
      actionTaken: String,
      severity: {
        type: String,
        enum: ["Minor", "Major", "Critical"],
      },
    }],
    
    // Extracurricular Activities
    extracurricularActivities: [{
      activityName: String,
      description: String,
      achievements: [String],
      startDate: Date,
      endDate: Date,
    }],
    
    // Enrollment Status
    enrollmentStatus: {
      type: String,
      enum: ["Active", "Inactive", "Dropped", "Graduated", "Suspended"],
      default: "Active",
    },
    
    // Additional Info
    disability: String,
    specialNeeds: String,
    scholarshipEligible: Boolean,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// Indexes
studentSchema.index({ enrollmentNumber: 1, tenantId: 1 });
studentSchema.index({ userId: 1, tenantId: 1 });
studentSchema.index({ currentClass: 1, tenantId: 1 });
studentSchema.index({ tenantId: 1 });

export default mongoose.model("Student", studentSchema);
