import mongoose from "mongoose";

const admissionSchema = new mongoose.Schema(
  {
    applicationNumber: {
      type: String,
      required: true,
      unique: true,
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
    
    // Applicant Information
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: String,
    phone: String,
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    
    // Academic Details
    applyingForClass: {
      type: Number,
      enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      required: true,
    },
    academicYear: String,
    previousSchool: String,
    previousPercentage: Number,
    
    // Parent/Guardian Information
    parentName: String,
    parentEmail: String,
    parentPhone: String,
    parentOccupation: String,
    
    // Documents
    documents: [{
      documentType: {
        type: String,
        enum: ["Birth Certificate", "Transfer Certificate", "Previous Marksheet", "Aadhaar"],
      },
      fileUrl: String,
      uploadedAt: Date,
    }],
    
    // Application Status
    status: {
      type: String,
      enum: ["Submitted", "Under Review", "Interview Scheduled", "Approved", "Rejected", "Waitlisted"],
      default: "Submitted",
    },
    
    // Workflow
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviewDate: Date,
    reviewComments: String,
    
    interviewScheduledDate: Date,
    interviewResult: String,
    
    // Final Decision
    admissionDate: Date,
    enrollmentNumber: String, // Generated when approved
    rejectionReason: String,
    
    // Communication
    lastNotificationSent: Date,
    notificationCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// Indexes
admissionSchema.index({ applicationNumber: 1, tenantId: 1 });
admissionSchema.index({ status: 1, tenantId: 1 });
admissionSchema.index({ email: 1, tenantId: 1 });

export default mongoose.model("Admission", admissionSchema);
