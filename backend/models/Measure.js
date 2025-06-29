import mongoose from "mongoose";

const measureSchema = new mongoose.Schema(
  {
    kpi_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "KPI2",
      required: true,
    },
    measure_name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Measure = mongoose.model("Measure", measureSchema);
export default Measure;
