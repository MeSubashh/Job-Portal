import React, { useState } from 'react';
import dayjs from 'dayjs';
import BriefcaseIcon from '@mui/icons-material/Work';
import axios from 'axios';
// import './JobCardRecruiter.css';
function JobCard(props) {
  const date1 = dayjs(Date.now());
  const diffInDays = date1.diff(props.publishedAt, 'day');
  const [showModal, setShowModal] = useState(false);

  const handleApplyClick = () => {
    setShowModal(true);
  };

  const handleApplyJob = async ()=>{
    try {
      const response = await axios.post('http://localhost:5000/applyJob', {
        jobId: props._id,
        applicantId: props.user, // You'll need to pass currentUser from your state or context
        employerId: props.employerID
      });
      
      if (response.data.success) {
        alert('Job application submitted successfully');
      } else {
        alert('Error submitting job application');
      }
    } catch (error) {
      console.error('Error applying for job:', error);
      alert('Error applying for job');
    }
  }

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const experienceText = props.experience === 'Not Applicable' ? 'No prior experience required' : props.experience;

  return (
    <div className='mainJob'>
      <div className='entireJob'>
        <div className='eachJob-left'>
          <h1 className='text-lg font-semibold'>{props.title} - {props.companyName}</h1>
          <p>{props.jobType} &#x2022; {experienceText} &#x2022; {props.location}</p>
          <p>{props.salary}</p>
        </div>
        <div className='eachJob-right'>
          <p>{diffInDays} Days Ago</p>
          <button className='apply-button' onClick={handleApplyClick}>Apply</button>
        </div>
      </div>
      {showModal && (
        <div className='modal'>
          <div className='modal-content'>
            <span className='close' onClick={handleCloseModal}>&times;</span>
            <h2>{props.companyName}</h2>
            <p>{props.title}</p>
            <p>{props.salary}</p>
            <p>{props.location} &#x2022; Posted {diffInDays} Ago &#x2022; {props.applicantsCount}</p>
            <p><BriefcaseIcon fontSize="small" /> {props.workType === 'Remote' ? <span className='highlight'>{props.workType}</span> : props.workType} &#x2022; {experienceText}</p>
            <button className='apply-button' onClick={handleApplyJob}>Apply</button>
            <h3>About the job</h3>
            <p className='modal-description'>{props.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobCard;
