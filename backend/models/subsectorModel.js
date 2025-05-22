import mongoose from "mongoose";
const subsectorSchema = new mongoose.Schema(
  {
    sectorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sector",
      required: true,
    },
    subsector_name: { type: String, required: true },
  },
  { timestamps: true }
);

const subsectorModel = mongoose.model("subsector", subsectorSchema);

export default subsectorModel;
