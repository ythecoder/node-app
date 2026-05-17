import mongoose from "mongoose";

const parentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
    parentType: {
      type: String,
      enum: ["Father", "Mother", "Guardian", "Other"],
      required: true,
    },
    occupation: String,
    company: String,
    workPhone: String,
    workEmail: String,
    annualIncome: Number,
    educationLevel: String,
    
    // Linked Students
    linkedStudents: [{
      studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
      relationship: String,
    }],
    
    // Contact Preferences
    preferredContactMethod: {
      type: String,
      enum: ["Email", "Phone", "SMS", "WhatsApp"],
      default: "Email",
    },
    receiveNotifications: { type: Boolean, default: true },
    
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// Indexes
parentSchema.index({ userId: 1, tenantId: 1 });
parentSchema.index({ tenantId: 1 });

export default mongoose.model("Parent", parentSchema);
