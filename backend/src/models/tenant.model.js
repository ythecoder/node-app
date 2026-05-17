import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema(
  {
    schoolName: {
      type: String,
      required: true,
    },
    schoolCode: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
    contactEmail: {
      type: String,
      required: true,
    },
    contactPhone: String,
    website: String,
    logo: String,
    principalName: String,
    academicYear: String,
    establishedYear: Number,
    totalStudents: { type: Number, default: 0 },
    totalStaff: { type: Number, default: 0 },
    subscriptionPlan: {
      type: String,
      enum: ["Basic", "Premium", "Enterprise"],
      default: "Basic",
    },
    isActive: { type: Boolean, default: true },
    metadata: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true },
);

export default mongoose.model("Tenant", tenantSchema);
