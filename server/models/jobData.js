const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    jobId : String,
    publishedAt : String,
    salary : String,
    title : String,
    jobURL :String,
    companyName : String,
    location : String,
    postedTime : String,
    applicantsCount : String,
    description : String,
    jobType:String,
    experience : String,
    workType : String,
    sector : String,
    employerID : String
});

const jobModel = mongoose.model('job', jobSchema);

module.exports = jobModel;
