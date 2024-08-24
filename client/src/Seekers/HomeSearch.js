import React, { useEffect, useState } from 'react';
import '../styles/home.css';
import Navbar from '../Headers/Navbar';
import JobCard from './JobCard';
import axios from 'axios';
import Pagination from './pagination';
import dayjs from 'dayjs';

function HomeSearch() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage] = useState(10);
  const [currentUser,setUser] = useState('');

  // State for filters
  const [jobRole, setJobRole] = useState('');
  const [jobType, setJobType] = useState('');
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    axios.get("http://localhost:5000/fetchJobs")
      .then((response) => {
        const jobsArray = Object.keys(response.data).map(key => response.data[key]);
        setJobs(jobsArray);
        setFilteredJobs(jobsArray); // Show all jobs initially
      })
      .catch((err) => console.log(err));
    
      axios.get('http://localhost:5000/currentUser')
      .then(response => {
        setUser(response.data.userId)
        })
      .catch(err => console.log(err));
  }, []);

  const handleSearch = () => {
    let filtered = [...jobs];

    if (jobRole) {
        const excludedWords = ['developer', 'development', 'analyst','engineer']; // Words to exclude from job roles
        const selectedRoles = jobRole.toLowerCase().split(' ')
          .filter(role => !excludedWords.includes(role.trim())); // Filter out excluded words
        filtered = filtered.filter(job => {
          const jobTitle = job.title.toLowerCase();
          return selectedRoles.some(role => jobTitle.includes(role.trim()));
        });
    }

    if (jobType) {
      filtered = filtered.filter(job => job.jobType === jobType);
    }

    if (sortBy) {
      if (sortBy === "Date posted") {
        filtered = filtered.sort((a, b) => {
          const dateA = dayjs(a.publishedAt || '2024-06-15'); // Default to the epoch date if publishedAt is empty
          const dateB = dayjs(b.publishedAt || '2024-06-15'); // Default to the epoch date if publishedAt is empty
          return dateB.diff(dateA); // Compare each publishedAt date
        });
      } else if (sortBy === "Salary") {
        filtered = filtered.sort((a, b) => {
          const getNumericalSalary = (salary) => {
            if (typeof salary === 'string') {
              const value = parseFloat(salary.replace(/[^0-9.]/g, ''));
              if (salary.includes('LPA')) {
                return value * 100000; // Convert LPA to annual salary
              } else if (salary.includes('K')) {
                return value * 1000; // Convert K to annual salary
              }
            }
            return 0; // Return 0 if the salary format is unrecognized
          };
  
          const salaryA = getNumericalSalary(a.salary);
          const salaryB = getNumericalSalary(b.salary);
  
          return salaryB - salaryA; // Sort in descending order
        });
      }
    }
    setFilteredJobs(filtered);
    setCurrentPage(1); // Reset to the first page after search
  };

  const lastPostIndex = currentPage * postPerPage;
  const firstPostIndex = lastPostIndex - postPerPage;
  const currentJobs = filteredJobs.slice(firstPostIndex, lastPostIndex);

  return (
    <div className='HomeSearch'>
      <Navbar />
      <div style={{
          marginTop: '5px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          color: 'black'
        }}>
          <h1 style={{ fontSize: '4em', fontWeight: 'bold' }}>Your Ideal job awaits, Start the Search</h1>
          <p style={{ fontSize: '20px' }}>Get the latest job openings that best suit you!</p>
        </div>
      <div className='search'>
        <select onChange={(e) => setJobRole(e.target.value)}>
          <option value="" disabled hidden>Select Job role</option>
          <option value="Python Developer">Python Developer</option>
          <option value="Java Developer">Java Developer</option>
          <option value="SQL Engineer">SQL Engineer</option>
          <option value="Full Stack Developer">Full Stack Developer</option>
          <option value="Software Engineer">Software Engineer</option>
          <option value="Data Analyst">Data Analyst</option>
        </select>
        <select onChange={(e) => setJobType(e.target.value)}>
          <option value="" disabled hidden>Select Job Type</option>
          <option value="Full-Time">Full-Time</option>
          <option value="Internship">Internship</option>
        </select>
        <select onChange={(e) => setSortBy(e.target.value)}>
          <option value="" disabled hidden>Select Sort By</option>
          <option value="Date posted">Date posted</option>
          <option value="Salary">Salary</option>
        </select>
        <button onClick={handleSearch}>Search</button>
      </div>
      {currentJobs.map((job) => (
        <JobCard key={job._id} {...job} user={currentUser}/>
      ))}
      <div className='pagination'>
        <Pagination totalPosts={filteredJobs.length} postsPerPage={postPerPage} setCurrentPage={setCurrentPage} />
      </div>
    </div>
  );
}

export default HomeSearch;
