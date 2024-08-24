const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
  jobId: {
    type: String,
    required: true
  },
  applicantId: {
    type: String,
    required: true
  },
  employerId: {
    type: String,
    Default : "Pre Defined Job"
  },
  appliedAt: {
    type: Date,
    default: Date.now
  }
});

const jobApplicationModel = mongoose.model('jobApplication', jobApplicationSchema);

module.exports = jobApplicationModel;
