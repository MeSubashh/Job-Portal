import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Navbar = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const reloadPage = ()=>{
    window.location.reload();
  }
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = ()=>{
    // axios.get("http://localhost:5000/logout")
    // .catch((err)=>console.log(err))
    navigate('/');
  }
  const handleProfile = ()=>{
    // reloadPage();
    navigate('/profile');
  }
  const handleApplications = ()=>{
    navigate('/appliedJobs');
  }
  

  return (
    <AppBar position="static">
      <Toolbar>
      <Button color="inherit" component='a' href="/jobportal" style={{ color: 'white', fontWeight: 'bold' }}>
          Job Portal
        </Button>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
        <Button color="inherit" component="a" href="/jobPortal" style={{ color: 'white', fontWeight: 'bold' }}>
          Jobs 
        </Button>
    
        <Button color="inherit" component="a" href="/jobPortal" style={{ color: 'white', fontWeight: 'bold' }}>
          Messages
        </Button>
        <Avatar
          alt="User Avatar"
          src="https://via.placeholder.com/150"
          style={{ cursor: 'pointer', marginLeft: 'auto' }}
          onClick={handleMenuOpen}
        />
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={handleProfile}>My Profile</MenuItem>
          <MenuItem onClick={handleApplications}>My Applications</MenuItem>
          <MenuItem onClick={handleMenuClose}>FAQ</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
