import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import '../styles/appliedJobs.css';
import NavbarRecruiter from '../Headers/NavbarRecruiter';

function ReceivedJobs() {
  const [appliedJobs, setAppliedJobs] = useState([]);

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  const fetchAppliedJobs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/receivedJobs');
      setAppliedJobs(response.data);
    } catch (error) {
      console.error('Error fetching received jobs:', error);
    }
  };

  return (
    <div>
      <NavbarRecruiter />
      <div className="container">
        <h2>Applicants for Your Jobs</h2>
        <div className="row">
          {appliedJobs.length === 0 ? (
            <p>No applicants found for your jobs.</p>
          ) : (
            appliedJobs.map((job, index) => (
              <div className="col-md-6" key={index}>
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{job.title}</h5>
                    <p className="card-text">{job.companyName}</p>
                    <p className="card-text">
                      <small className="text-muted">{job.location}</small>
                    </p>
                    <p className="card-text">
                      <small className="text-muted">
                        Applied on {dayjs(job.appliedAt).format('MMMM D, YYYY')}
                      </small>
                    </p>
                    <div className="card-details">
                      <p>
                        <strong>Applicant:</strong> {job.applicant.username}
                      </p>
                      <p>
                        <strong>Email:</strong> {job.applicant.email}
                      </p>
                      <p>
                        <strong>Phone:</strong> {job.applicant.phone}
                      </p>
                      <p>
                        <strong>Gender:</strong> {job.applicant.gender}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ReceivedJobs;
