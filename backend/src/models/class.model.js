import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      required: true,
    },
    classNumber: {
      type: Number,
      enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      required: true,
    },
    section: {
      type: String,
      required: true,
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
    
    // Class Information
    academicYear: String,
    classTeacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
    },
    totalStrength: Number,
    currentStrength: { type: Number, default: 0 },
    
    // Classroom Details
    roomNumber: String,
    buildingName: String,
    capacity: Number,
    
    // Associated Data
    students: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    }],
    subjects: [{
      subjectName: String,
      subjectCode: String,
      teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Staff",
      },
    }],
    
    // Timetable
    timetable: [{
      day: String,
      periodNumber: Number,
      subject: String,
      teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Staff",
      },
      startTime: String,
      endTime: String,
    }],
    
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// Indexes
classSchema.index({ classNumber: 1, section: 1, tenantId: 1 });
classSchema.index({ tenantId: 1 });
classSchema.index({ classTeacher: 1 });

export default mongoose.model("Class", classSchema);
