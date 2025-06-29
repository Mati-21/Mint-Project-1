import mongoose from "mongoose";

const AssignmentSchema = new mongoose.Schema(
  {
    Kpi_Name: { type: String, required: true },
    Kpi_Id: { type: mongoose.Schema.Types.ObjectId, required: true },
    Kra_Name: { type: String, required: true },
    Kra_Id: { type: mongoose.Schema.Types.ObjectId, required: true },
    Goal_Name: { type: String, required: true },
    Goal_Id: { type: mongoose.Schema.Types.ObjectId, required: true },

    measures: [
      {
        measure: { type: String, required: true },
        target: { type: Number, required: true },
        year: { type: String, required: true },
        quarter: { type: String, required: true },
        performed: { type: Boolean, default: false },
      },
    ],

    assignedUser: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
      fullName: String,
      email: String,
      role: String,
      sector: mongoose.Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

const Assignment = mongoose.model("Assignment", AssignmentSchema);
export default Assignment;
