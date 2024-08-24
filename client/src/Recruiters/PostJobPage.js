import React, { useState,useEffect} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import JobCardRecruiter from './JobCardRecruiter'; // Importing the JobCard component
import '../styles/PostJobPage.css';
import '../styles/JobCardRecruiter.css';
import dayjs from 'dayjs';
import axios from 'axios';
import NavbarRecruiter from '../Headers/NavbarRecruiter';
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  maxHeight: '80vh',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  overflow: 'auto',
};

const PostJobPage = () => {
  const reloadPage = ()=>{
    window.location.reload();
  }
  const [jobs, setJobs] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [sector, setSector] = useState('');
  const [workType, setWorkType] = useState('full-time');
  const [salary, setSalary] = useState('');
  const [location, setLocation] = useState('');
  const [experience, setExperience] = useState('');
  const [description, setDescription] = useState('');

  useEffect(()=>{
    axios.get("http://localhost:5000/postedjobs")
    .then((response)=>{
          setJobs(response.data);
        })
    .catch((err)=>console.log(err))
  },[]);
  
  const handleAddJob = () => {
    const datePosted = dayjs(Date.now());
    const jobData = {title,companyName,sector,workType,salary,location,experience,description,datePosted};
    axios.post("http://localhost:5000/postjob",jobData)
    .then(response => {
      reloadPage();
    })
    .catch(err => {
      console.log(err);
    });
    resetJobForm();
    setModalOpen(false);
  };

  const resetJobForm = () => {
    setTitle('');
    setCompanyName('');
    setSector('');
    setWorkType('full-time');
    setSalary('');
    setLocation('');
    setExperience('');
    setDescription('');
  };

  return (
    // <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: 8 }}>
    <div>
      <NavbarRecruiter/>
      <Box>    
      <Typography variant="h5" sx={{ marginBottom: 2,marginTop: 3,marginLeft:2 }}>
        Post a New Job
        <IconButton onClick={() => setModalOpen(true)} className="add-icon-button">
          <AddIcon />
        </IconButton>
      </Typography>
      {jobs.map((job, index) => (
        <JobCardRecruiter key={index} {...job} />
      ))}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" className="modal-header">
            Add Job Entry
          </Typography>
          <TextField id="title" label="Title" variant="outlined" fullWidth margin="normal" value={title} onChange={(e) => setTitle(e.target.value)} />
          <TextField id="companyName" label="Company Name" variant="outlined" fullWidth margin="normal" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
          <TextField id="sector" label="Sector" variant="outlined" fullWidth margin="normal" value={sector} onChange={(e) => setSector(e.target.value)} />
          <FormControl component="fieldset" fullWidth margin="normal">
            <FormLabel component="legend">Work Type</FormLabel>
            <RadioGroup row value={workType} onChange={(e) => setWorkType(e.target.value)}>
              <FormControlLabel value="Full-Time" control={<Radio />} label="Full-time" />
              <FormControlLabel value="Part-Time" control={<Radio />} label="Part-time" />
              <FormControlLabel value="Internship" control={<Radio />} label="Internship" />
            </RadioGroup>
          </FormControl>
          <TextField id="salary" label="Salary" variant="outlined" fullWidth margin="normal" value={salary} onChange={(e) => setSalary(e.target.value)} />
          <TextField id="location" label="Location" variant="outlined" fullWidth margin="normal" value={location} onChange={(e) => setLocation(e.target.value)} />
          <TextField id="experience" label="Experience" variant="outlined" fullWidth margin="normal" value={experience} onChange={(e) => setExperience(e.target.value)} />
          <TextField id="description" label="Description" variant="outlined" fullWidth margin="normal" multiline rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
          
          <Button onClick={handleAddJob} variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }}>Submit</Button>
        </Box>
      </Modal>
    </Box>
    </div>
  );
};

export default PostJobPage;
