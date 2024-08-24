import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
const NavbarRecruiter = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = ()=>{
    // axios.get("http://localhost:5000/logout")
    // .catch((err)=>console.log(err))
    navigate('/');
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" component='a' href="/recruit" style={{ color: 'white', fontWeight: 'bold' }}>
          Job Portal
        </Button>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
          <Button color="inherit" component={Link} to="/receivedApplicants" style={{ color: 'white' , fontWeight: 'bold' }}>
            Applications Received
          </Button>
          <Button color="inherit" component={Link} to="/recruit" style={{ color: 'white', fontWeight: 'bold'  }}>
            Post a Job
          </Button>
          <Button color="inherit" component={Link} to="/recruit" style={{ color: 'white' , fontWeight: 'bold' }}>
            Messages
          </Button>
          <Avatar
            alt="User Avatar"
            src="https://via.placeholder.com/150"
            style={{ cursor: 'pointer', marginLeft: 16 }}
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
            <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
              My Profile
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>FAQ</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default NavbarRecruiter;
