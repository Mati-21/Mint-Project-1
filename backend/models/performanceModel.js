import mongoose from 'mongoose';

const performanceSchema = new mongoose.Schema({
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan',
    required: true,
    unique: true, // one performance record per plan
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fullName: {
    type: String,
    default: '',
  },
  role: {
    type: String,
    required: true,
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
  deskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Desk',
    default: null,
  },
  kpiId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'KPI2',
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  performanceYear: {
    type: Number,
    default: 0,
  },
  performanceDescription: {
    type: String,
    default: '',
  },
  q1Performance: {
    value: { type: Number, default: 0 },
    description: { type: String, default: '' },
  },
  q2Performance: {
    value: { type: Number, default: 0 },
    description: { type: String, default: '' },
  },
  q3Performance: {
    value: { type: Number, default: 0 },
    description: { type: String, default: '' },
  },
  q4Performance: {
    value: { type: Number, default: 0 },
    description: { type: String, default: '' },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Performance = mongoose.model('Performance', performanceSchema);
export default Performance;
