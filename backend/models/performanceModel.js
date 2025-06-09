import mongoose from 'mongoose';

const performanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  kpiName: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  quarter: {
    type: String,
    default: null, // null means yearly performance
  },
  target: {
    type: String,
    default: '',
  },
  performanceMeasure: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  sectorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sector',
    default: null,
  },
  subsectorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subsector',
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Performance = mongoose.model('Performance', performanceSchema);
export default Performance;
