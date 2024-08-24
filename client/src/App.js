import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Routes and Route
import SignInSide from './SignInSide';
import SignUp from './SignUp';
import HomeSearch from './Seekers/HomeSearch';
import './styles/home.css';
import ProfilePage from './ProfilePage';
import PostJobPage from './Recruiters/PostJobPage';
import AppliedJobs from './Seekers/appliedJobs';
import ReceivedJobs from './Recruiters/ReceivedJobs';
function App() {
  return (
    <Router>
      <Routes> {/* Wrap Routes around your Route components */}
        <Route path="/" element={<SignInSide />} /> {/* Use element prop to render component */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/jobPortal" element={<HomeSearch />} />
        <Route path = "/profile" element = {<ProfilePage/>}/>
        <Route path="/recruit" element = {<PostJobPage/>}/>
        <Route path ="/appliedJobs" element = {<AppliedJobs/>}/>
        <Route path = "/receivedApplicants" element = {<ReceivedJobs/>}/>
      </Routes>
    </Router>
  );
}

export default App;
