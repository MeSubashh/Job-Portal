import React, { useState } from 'react';
import '../styles/JobCardRecruiter.css';
import dayjs from 'dayjs';
import BriefcaseIcon from '@mui/icons-material/Work'; // Import the briefcase icon
import axios from 'axios';

const JobCardRecruiter = ({ _id,title, companyName, workType, experience, location, salary, publishedAt, description, applicantsCount }) => {
  const [showModal, setShowModal] = useState(false);
  const date1 = dayjs(Date.now());
  const diffInDays = date1.diff(publishedAt, 'day');
  const handleViewClick = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };
  const reloadPage = ()=>{
    window.location.reload();
  }
  const  handleRemoveClick= async ()=>{
      axios.post("http://localhost:5000/removeJob",{_id})
      .then(reloadPage())
      .catch((err)=>console.log(err))
  }
  return (
    <div className='mainJob'>
      <div className='entireJob'>
        <div className='eachJob-left'>
          <h1 className='text-lg font-semibold'>{title} - {companyName}</h1>
          <p>{workType === 'Remote' ? <span className='highlight'>{workType}</span> : workType} &#x2022; {experience} &#x2022; {location}</p>
          <p>{salary}</p>
          <p className='job-description'>{description}</p>
        </div>
        <div className='eachJob-right'>
          <p>Posted {diffInDays} days ago</p>
          <button className='apply-button' onClick={handleViewClick}>View</button>
          <button className='apply-button' onClick={handleRemoveClick}>Remove</button>
        </div>
      </div>

      {showModal && (
        <div className='modal'>
          <div className='modal-content'>
            <span className='close' onClick={handleCloseModal}>&times;</span>
            <h2>{companyName}</h2>
            <p>{title}</p>
            <p>{salary}</p>
            <p>{location} &#x2022; Posted {diffInDays} Ago &#x2022; {applicantsCount}</p>
            <p><BriefcaseIcon fontSize="small" /> {workType === 'Remote' ? <span className='highlight'>{workType}</span> : workType} &#x2022; {experience}</p>
            <h3>About the job</h3>
            <p className='modal-description'>{description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobCardRecruiter;



