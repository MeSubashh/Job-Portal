const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  personType: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  birthday: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  number: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  zip: {
    type: String,
    required: true
  },
  education: [{
    school: {
      type: String,
      required: true
    },
    board: {
      type: String,
      required: true
    },
    degree: {
      type: String,
      required: true
    },
    academicYear: {
      type: String,
      required: true
    },
    gradeType: {
      type: String,
      required: true
    },
    grade: {
      type: Number,
      required: true
    }
  }],
  workExperience: [{
    company: {
      type: String,
      required: true
    },
    position: {
      type: String,
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    }
  }]
});

const profileModel = mongoose.model('Profile', profileSchema);

module.exports = profileModel;
