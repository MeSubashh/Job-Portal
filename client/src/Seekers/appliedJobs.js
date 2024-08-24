import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import '../styles/appliedJobs.css';
import Navbar from '../Headers/Navbar';

function AppliedJobs() {
  const [appliedJobs, setAppliedJobs] = useState([]);

  useEffect(() => {
    // Fetch the applied jobs for the current user
    axios.get('http://localhost:5000/appliedJobs')
      .then(response => {
        setAppliedJobs(response.data);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <Navbar/>
    <div className="container">
      <h2>Jobs You Have Applied To</h2>
      <div className="row">
        {appliedJobs.map((job, index) => (
          <div className="col-md-6" key={index}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{job.title}</h5>
                <p className="card-text">{job.companyName}</p>
                <p className="card-text"><small className="text-muted">{job.location}</small></p>
                <p className="card-text"><small className="text-muted">Applied on {dayjs(job.appliedDate).format('MMMM D, YYYY')}</small></p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}

export default AppliedJobs;
