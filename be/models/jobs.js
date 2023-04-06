const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobSchema = new Schema({
  position: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  created_by: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  is_approved: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Job', jobSchema);
