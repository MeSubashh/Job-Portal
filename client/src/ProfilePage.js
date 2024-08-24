import React, { useState,useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Modal from '@mui/material/Modal';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import './styles/ProfilePage.css';
import axios from 'axios';
import Navbar from './Headers/Navbar';
import NavbarRecruiter from './Headers/NavbarRecruiter';

const ProfilePage = () => {
  // General Information State
  const reloadPage = ()=>{
    window.location.reload();
  }
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [number, setNumber] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [userType,setUser] = useState('');

  // Education State
  const [education, setEducation] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [school, setSchool] = useState('');
  const [board, setBoard] = useState('');
  const [degree, setDegree] = useState('10th');
  const [academicYear, setAcademicYear] = useState('');
  const [grade, setGrade] = useState('');
  const [gradeType, setGradeType] = useState('CGPA');

  // Work Experience State
  const [workExperience, setWorkExperience] = useState([]);
  const [workExperienceModalOpen, setWorkExperienceModalOpen] = useState(false);
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Profile Picture State
  const [profilePic, setProfilePic] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  // Resume State
  const [resume, setResume] = useState(null);
  useEffect(() => {
    axios.post("http://localhost:5000/fetchProfile")
      .then(response => {
        const data = response.data;
        console.log(data);
        setFirstName(data.firstName || '');
        setLastName(data.lastName || '');
        setBirthday(data.birthday ? data.birthday.split('T')[0] : '');
        setGender(data.gender || '');
        setEmail(data.email || '');
        setPhone(data.phone || '');
        setAddress(data.address || '');
        setNumber(data.number || '');
        setCity(data.city || '');
        setState(data.state || '');
        setZip(data.zip || '');
        setEducation(data.education || []);
        setWorkExperience(data.workExperience || []);
        setUser(data.currentUserType || '');
        console.log('User Type:', data.currentUserType); // Check if the user type is correctly fetched
      })
      .catch(err => {
        console.error('Error fetching profile:', err.response.data);
        setUser(err.response.data.currentUserType);
      });
  }, []);
  

  const handleSubmit = (event) => {
    event.preventDefault();
    const profileData = {
      firstName,
      lastName,
      birthday,
      gender,
      email,
      phone,
      address,
      number,
      city,
      state,
      zip,
      education,
      workExperience
    };
    axios.post("http://localhost:5000/updateProfile", profileData)
      .then(response => {
        console.log(response.data);
        reloadPage();
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleAddEducation = () => {
    setEducation([...education, { school, board, degree, academicYear, grade, gradeType }]);
    setModalOpen(false);
    resetEducationForm();
  };

  const resetEducationForm = () => {
    setSchool('');
    setBoard('');
    setDegree('10th');
    setAcademicYear('');
    setGrade('');
    setGradeType('CGPA');
  };

  const handleAddWorkExperience = () => {
    setWorkExperience([
      ...workExperience,
      { company, position, startDate, endDate }
    ]);
    resetWorkExperienceForm();
    setWorkExperienceModalOpen(false);
  };

  const resetWorkExperienceForm = () => {
    setCompany('');
    setPosition('');
    setStartDate('');
    setEndDate('');
  };

  const formatDate = (dateStr) => {
    const options = { year: 'numeric', month: 'long' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  const handleProfilePicUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
    }
  };

  const handleRemoveProfilePic = () => {
    setProfilePic(null);
  };

  const handleResumeUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setResume(URL.createObjectURL(file));
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      {userType === "Job Seeker" ? <Navbar/> : <NavbarRecruiter/>}
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 8 }}>
      <Box sx={{ position: 'relative', display: 'inline-block' }}>
        <Avatar
          alt="User Avatar"
          src={profilePic}
          sx={{ width: 150, height: 150, marginBottom: 2 }}
          onClick={handleClick}
        />
        <IconButton
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            backgroundColor: 'white',
            borderRadius: '50%',
          }}
          onClick={handleClick}
        >
          <CameraAltIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem component="label">
            Add a Picture
            <input type="file" hidden onChange={handleProfilePicUpload} />
          </MenuItem>
          <MenuItem onClick={handleRemoveProfilePic}>Remove Picture</MenuItem>
        </Menu>
      </Box>
      <Typography variant="h4" sx={{ marginBottom: 2 }}>Profile</Typography>
      <form className="profile-form" onSubmit={handleSubmit}>
        {/* General Information Section */}
        <Typography variant="h6" className="section-title">General Information</Typography>
        <TextField id="firstName" label="First Name" variant="outlined" className="profile-input" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        <TextField id="lastName" label="Last Name" variant="outlined" className="profile-input" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        <TextField
          id="birthday"
          label="Birthday"
          type="date"
          InputLabelProps={{ shrink: true }}
          className="profile-input"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
          inputProps={{
            max: new Date().toISOString().split("T")[0],
          }}
        />
        <TextField id="gender" label="Gender" variant="outlined" className="profile-input" value={gender} onChange={(e) => setGender(e.target.value)} select>
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </TextField>
        <TextField id="email" label="Email" variant="outlined" className="profile-input" value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField id="phone" label="Phone" variant="outlined" className="profile-input" value={phone} onChange={(e) => setPhone(e.target.value)} />

        {/* Address Section */}
        <Typography variant="h6" className="section-title">Address</Typography>
        <TextField id="address" label="Address" variant="outlined" className="profile-input" value={address} onChange={(e) => setAddress(e.target.value)} />
        <TextField id="number" label="Number" variant="outlined" className="profile-input" value={number} onChange={(e) => setNumber(e.target.value)} />
        <TextField id="city" label="City" variant="outlined" className="profile-input" value={city} onChange={(e) => setCity(e.target.value)} />
        <TextField id="state" label="State" variant="outlined" className="profile-input" value={state} onChange={(e) => setState(e.target.value)} />
        <TextField id="zip" label="ZIP" variant="outlined" className="profile-input" value={zip} onChange={(e) => setZip(e.target.value)} />

        {/* Education Section */}
        <Typography variant="h6" className="section-title">Education
          <IconButton onClick={() => setModalOpen(true)}>
            <AddIcon />
          </IconButton>
        </Typography>
        {education.map((edu, index) => (
          <Card key={index} sx={{ width: '100%', marginTop: 2 }}>
            <CardContent>
              <Typography variant="h6">{edu.school} | {edu.degree}</Typography>
              <Typography variant="body1">Academic Year: {edu.academicYear}</Typography>
              <Typography variant="body1">Grade: {edu.grade}</Typography>
            </CardContent>
          </Card>
        ))}

        {/* Work Experience Section */}
        <Typography variant="h6" className="section-title">Work Experience
          <IconButton onClick={() => setWorkExperienceModalOpen(true)}>
            <AddIcon />
          </IconButton>
        </Typography>
        {workExperience.map((exp, index) => (
          <Card key={index} sx={{ width: '100%', marginTop: 2 }}>
            <CardContent>
              <Typography variant="h6">{exp.position} at {exp.company}</Typography>
              <Typography variant="body1">{formatDate(exp.startDate)} - {formatDate(exp.endDate)}</Typography>
            </CardContent>
          </Card>
        ))}
          <Box  className="upload-resume-container">
          <Button variant="contained" component="label">
            Upload Resume
            <input type="file" hidden onChange={handleResumeUpload} />
          </Button>
          {resume && (
            <Box mt={2}>
              <a href={resume} target="_blank" rel="noopener noreferrer">View Uploaded Resume</a>
            </Box>
          )}
        </Box>
        <Button variant="contained" color="primary" type="submit" className="save-button">Save Changes</Button>
      </form>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <Box sx={{ ...modalStyle }}>
            <Typography variant="h6">Add Education</Typography>
            <TextField label="School" value={school} onChange={(e) => setSchool(e.target.value)} fullWidth margin="normal" />
            <TextField label="Board" value={board} onChange={(e) => setBoard(e.target.value)} fullWidth margin="normal" />
            <FormLabel component="legend">Degree</FormLabel>
            <RadioGroup row value={degree} onChange={(e) => setDegree(e.target.value)}>
              <FormControlLabel value="10th" control={<Radio />} label="10th" />
              <FormControlLabel value="12th" control={<Radio />} label="12th" />
              <FormControlLabel value="UG" control={<Radio />} label="UG" />
              <FormControlLabel value="PG" control={<Radio />} label="PG" />
            </RadioGroup>
            <TextField label="Academic Year" value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} fullWidth margin="normal" />
            <TextField label="Grade" value={grade} onChange={(e) => setGrade(e.target.value)} fullWidth margin="normal" />
            <FormControl component="fieldset" margin="normal">
              <FormLabel component="legend">Grade Type</FormLabel>
              <RadioGroup row value={gradeType} onChange={(e) => setGradeType(e.target.value)}>
                <FormControlLabel value="CGPA" control={<Radio />} label="CGPA" />
                <FormControlLabel value="Percentage" control={<Radio />} label="Percentage" />
              </RadioGroup>
            </FormControl>
            <Button variant="contained" onClick={handleAddEducation} sx={{ ml: -7, mt: 12, alignSelf: 'center' }}>Add</Button>
          </Box>
      </Modal>




      <Modal open={workExperienceModalOpen} onClose={() => setWorkExperienceModalOpen(false)}>
        <Box sx={{ ...modalStyle }}>
          <Typography variant="h6">Add Work Experience</Typography>
          <TextField label="Company" value={company} onChange={(e) => setCompany(e.target.value)} fullWidth margin="normal" />
          <TextField label="Position" value={position} onChange={(e) => setPosition(e.target.value)} fullWidth margin="normal" />
          <TextField label="Start Date" type="date" InputLabelProps={{ shrink: true }} value={startDate} onChange={(e) => setStartDate(e.target.value)} fullWidth margin="normal" />
          <TextField label="End Date" type="date" InputLabelProps={{ shrink: true }} value={endDate} onChange={(e) => setEndDate(e.target.value)} fullWidth margin="normal" />
          <Button variant="contained" onClick={handleAddWorkExperience}>Add</Button>
        </Box>
      </Modal>
    </Box>
    </div>
  );
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default ProfilePage;
