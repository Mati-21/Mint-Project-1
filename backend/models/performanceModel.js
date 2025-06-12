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

  // Validation status for each period (like plan model)
  validationStatusYear: { type: String, default: 'Pending' },
  validationStatusQ1: { type: String, default: 'Pending' },
  validationStatusQ2: { type: String, default: 'Pending' },
  validationStatusQ3: { type: String, default: 'Pending' },
  validationStatusQ4: { type: String, default: 'Pending' },

  // Validation description for each period (like plan model)
  validationDescriptionYear: { type: String, default: '' },
  validationDescriptionQ1: { type: String, default: '' },
  validationDescriptionQ2: { type: String, default: '' },
  validationDescriptionQ3: { type: String, default: '' },
  validationDescriptionQ4: { type: String, default: '' },

  goalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal2' },
  kraId: { type: mongoose.Schema.Types.ObjectId, ref: 'KRA2' },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Performance = mongoose.model('Performance', performanceSchema);
export default Performance;
