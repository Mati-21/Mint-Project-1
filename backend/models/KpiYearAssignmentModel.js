import mongoose from "mongoose";

const kpiYearAssignmentSchema = new mongoose.Schema({
<<<<<<< Updated upstream
=======
  assignmentId: {
    type: String,
    required: false,
    unique: true, // optional, only if you want assignmentId to be unique
  },
>>>>>>> Stashed changes
  sectorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sector",
    required: true,
  },
  subsectorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subsector",
    required: false,
    default: null,
  },
<<<<<<< Updated upstream
  deskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Desk",
    required: false,
    default: null,
  },
=======
  // deskId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Desk",
  //   required: false,
  //   default: null,
  // },
>>>>>>> Stashed changes
  kpiId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "KPI2",
    required: true,
  },
  kraId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "KRA2",
    required: true,
  },
  goalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Goal2",
    required: true,
  },
  startYear: {
    type: Number,
    required: true,
    min: 1900,
    max: new Date().getFullYear() + 10,
  },
  endYear: {
    type: Number,
    required: true,
    min: 1900,
<<<<<<< Updated upstream
    max: new Date().getFullYear() + 10,
=======
    max: 2200,
>>>>>>> Stashed changes
  },
}, { timestamps: true });

const KpiYearAssignment = mongoose.model("KpiYearAssignment", kpiYearAssignmentSchema);
export default KpiYearAssignment;
