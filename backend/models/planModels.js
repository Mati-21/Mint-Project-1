import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  kpi_name: String,
  year: String,
  quarter: String,
  target: String,
  description: String,
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Plan = mongoose.model('Plan', planSchema);
export default Plan;
