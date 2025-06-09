import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
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
  kpi_name: {
    type: String,
    required: true,
  },
  kraId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'KRA2',
    required: true,
  },
  goalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goal2',
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  target: {
    type: Number,
    required: true,
  },
  q1: {
    type: Number,
    default: 0,
  },
  q2: {
    type: Number,
    default: 0,
  },
  q3: {
    type: Number,
    default: 0,
  },
  q4: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Unique index for KPI-year plan (single doc per KPI per year)
planSchema.index({ kpiId: 1, year: 1 }, { unique: true });

const Plan = mongoose.model('Plan', planSchema);
export default Plan;
