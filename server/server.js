const bcrypt = require('bcrypt');
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const axios = require('axios');
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const userModel = require("./models/database");
const jobModel = require("./models/jobData");
const profileModel = require("./models/seekerProfile");
const jobApplicationModel = require("./models/jobApplication");
const mongoose = require("mongoose");
const env = require('dotenv');
mongoose.connect("mongodb://localhost:27017/JobPortal");

const app = express();
const PORT = 5000;
env.config();
let currentUser;
let currentUserType;
// Middleware
app.use(cors());

app.use(express.json());
app.use(session({
  secret: "JOB PORTAL",
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));
app.use(passport.initialize());
app.use(passport.session());

//to hash
const saltRounds = 10;


//from recruiter post job
app.post("/postjob", async (req, res) => {
  // console.log(currentUser);
  // console.log(currentUserType);
  const {title,companyName,sector,workType,salary,location,experience,description,datePosted} = req.body;
  jobModel.create({employerID:currentUser,title:title,companyName:companyName,sector:sector,workType:workType,salary:salary,location:location,experience:experience,description:description,publishedAt : datePosted})
  .then((result)=>res.json(result))
  .catch((err)=>res.json(err))
});

//from recruiter posted jobs (fetch job)
app.get("/postedjobs", async (req, res) => {
  //console.log(currentUser);
  jobModel.find({employerID:currentUser})
  .then((result)=>res.json(result))
  .catch((err)=>res.json(err))
});

//info for applicants
app.get("/appliedJobs", async (req, res) => {
  try {
    const applications = await jobApplicationModel.find({ applicantId: currentUser });

    const jobsData = await Promise.all(applications.map(async (application) => {
      try {
        const job = await jobModel.findById(application.jobId);
        if (!job) {
          console.error(`Job with id ${application.jobId} not found`);
          return null; // Skip this application if the job is not found
        }

        return {
          jobId: application.jobId,
          title: job.title,
          companyName: job.companyName,
          location: job.location,
          appliedDate: application.appliedDate,
        };
      } catch (err) {
        console.error(`Error processing application with jobId ${application.jobId}:`, err);
        return null; // Skip this application if there's an error
      }
    }));

    const validJobsData = jobsData.filter(data => data !== null); // Filter out null values

    res.json(validJobsData);
  } catch (err) {
    console.error("Error fetching applied jobs:", err);
    res.status(500).json({ message: 'Error occurred', error: err.message });
  }
});

//info about applicants for employers
app.get("/receivedJobs", async (req, res) => {
  try {
    const applications = await jobApplicationModel.find({ employerId: currentUser });

    const jobsData = await Promise.all(applications.map(async (application) => {
      try {
        const job = await jobModel.findById(application.jobId);
        if (!job) {
          console.error(`Job with id ${application.jobId} not found`);
          return null; // Skip this application if the job is not found
        }

        const user = await userModel.findById(application.applicantId);
        if (!user) {
          console.error(`User with id ${application.applicantId} not found`);
          return null; // Skip this application if the user is not found
        }

        const profile = await profileModel.findOne({ email: user.email });
        if (!profile) {
          console.error(`Profile not found for user with email ${user.email}`);
          return null; // Skip this application if the profile is not found
        }

        return {
          jobId: application.jobId,
          applicantId: application.applicantId,
          employerId: application.employerId,
          title: job.title,
          companyName: job.companyName,
          location: job.location,
          appliedAt: application.appliedAt,
          applicant: {
            username: user.username,
            email: profile.email,
            phone: profile.phone,
            gender: profile.gender
          }
        };
      } catch (err) {
        console.error(`Error processing application with jobId ${application.jobId}:`, err);
        return null; // Skip this application if there's an error
      }
    }));

    const validJobsData = jobsData.filter(data => data !== null); // Filter out null values

    res.json(validJobsData);
  } catch (err) {
    console.error("Error fetching received jobs:", err);
    res.status(500).json({ message: 'Error occurred', error: err.message });
  }
});




//handle applied
app.post('/applyJob', async (req, res) => {
  const { jobId, applicantId, employerId } = req.body;
  
  try {
    const newApplication = new jobApplicationModel({
      jobId,
      applicantId,
      employerId
    });

    await newApplication.save();
    res.json({ success: true, message: 'Job application submitted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error submitting job application', error: error.message });
  }
});

//send current user 
app.get("/currentUser", async (req, res) => {
  console.log(currentUser);
  res.json({userId:currentUser});
});

//recruiter removes the job
app.post("/removeJob",(req,res)=>{
    const {_id} = req.body;
    jobModel.findByIdAndDelete({_id:_id}).then(console.log("deletion successful"));
});

app.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("http://localhost:3000/");
  });
});
//regarding the profile

app.post("/fetchProfile", async (req, res) => {
  try {
    // Find the user document using currentUser ID
    const user = await userModel.findOne({ _id: currentUser });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Find the profile using the user's email
    const profile = await profileModel.findOne({ email: user.email });
    
    if (!profile) {
      console.log(currentUserType);
      return res.status(404).json({ message: 'Profile not found',currentUserType: currentUserType});
    }
    const profileToSend = {
      ...profile.toObject(), // Convert Mongoose document to plain JavaScript object
      currentUserType: currentUserType
    };
    console.log("Found profile:", profileToSend);
    res.json(profileToSend);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: 'Error occurred', error: err.message });
  }
});


app.post("/updateProfile", async (req, res) => {
  //console.log("Inside update");
  //console.log("Current User ID:", currentUser);
  //console.log(currentUserType);

  try {
    // Find the user document using currentUser ID
    const user = await userModel.findOne({ _id: currentUser });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add user email and personType to req.body
    const updatedData = {
      ...req.body,
      email: user.email,
      personType: user.personType
    };

    // Update the profile using the user's email
    const presentProfile = await profileModel.findOne({ email: user.email });
    if (!presentProfile) {
      const newProfile = await profileModel.create(updatedData);
      console.log("Created profile:", newProfile);
      res.json(newProfile);
    } else {
      const updatedProfile = await profileModel.findOneAndUpdate(
        { email: user.email },
        updatedData, // Update with new data
        { new: true, upsert: true } // Return the updated document
      );
      console.log("Updated profile:", updatedProfile);
      res.json(updatedProfile);
    }
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: 'Error occurred', error: err.message });
  }
});


//fetching jobs
app.get("/fetchJobs",(req,res)=>{
  jobModel.find({})
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      console.log("Entered Error");
      res.json(err)})
});

// Routes
//Sign in using Google
app.get("/gsignin", passport.authenticate("googleSignIn", { scope: ["profile", "email"] }));
app.get("/callback", 
  passport.authenticate("googleSignIn", { failureRedirect: '/auth-failure' }),
  (req, res) => {
    res.redirect("/jobPortal");
  }
);
app.get("/auth-failure", (req, res) => {
  //console.log(req.session);
  const errorMessage = req.session.error? req.session.error : 'Authentication failed';
  const redirectUrl = `http://localhost:3000/?error=${encodeURIComponent(errorMessage)}`;
  res.redirect(redirectUrl);
});

//Sign up using Google

app.get("/gsignup", (req, res) => {
  req.session.userType = req.query.userType; // Store userType in session
  passport.authenticate("googleSignUp", { scope: ["profile", "email"] })(req, res);
});

app.get("/callbackSignUp", 
  passport.authenticate("googleSignUp", { failureRedirect: '/auth-failure' }),
  (req, res) => {
    res.redirect("http://localhost:3000/");
  }
);

app.get("/auth-failure", (req, res) => {
  //console.log(req.session);
  const errorMessage = req.session.error? req.session.error : 'Authentication failed';
  const redirectUrl = `http://localhost:3000/signup/?error=${encodeURIComponent(errorMessage)}`;
  res.redirect(redirectUrl);
});



app.post("/signup",(req,res)=>{
    const {firstName,lastName,email,password,userType} = req.body.data;
    const username = firstName+" "+lastName;
    userModel.findOne({email:email})
    .then(existingUser => {
      if (existingUser) {
        res.json({ message: 'Email already taken' });
      } else {
        // Create new user
        bcrypt.hash(password,saltRounds,(err,hashPassword)=>{
          if(err){
            res.json({ message: 'H-Error occurred' })
          }else{
            userModel.create({
              username: username,
              password: hashPassword,
              email:email,
              personType:userType
            }).then(result => res.json({ message: 'User created successfully' }))
              .catch(err => res.json({ message: 'Error occurred' }));
          }
        })
      }
    })
    .catch(err => res.json({ message: 'Error occurred' }));
});

app.post("/signin", (req, res) => {
  const { email, password } = req.body
  userModel.findOne({ email: email})
    .then(user => {
      if (user) {
        bcrypt.compare(password,user.password,(err,result)=>{
          if(err){
            res.json({ success: false, message: 'H-error occured' });
          }else{
            if(result){
              currentUser = user._id.toString();
              currentUserType = user.personType;
              res.json({ success: true, message: 'User authenticated successfully',userType:currentUserType});
            }else{
              res.json({ success: false, message: 'Incorrect password' });
            }
          }
        })
      } else {
        res.json({ success: false, message: 'User not found' });
      }
    })
    .catch(err => res.json({ success: false, message: 'Error occurred' }));
});

app.get("/jobPortal", (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("http://localhost:3000/jobPortal");
  } else {
    res.redirect("/");
  }
});

app.get("/check-auth", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ authenticated: true });
  } else {
    res.json({ authenticated: false });
  }
});

// Passport Google OAuth configuration
passport.use("googleSignIn",new GoogleStrategy({
  clientID: process.env.SIGN_IN_CLIENT_ID,
  clientSecret: process.env.SIGN_IN_CLIENT_SECRET,
  callbackURL: "http://localhost:5000/callback",
  userProfileURL: process.env.USER_PROFILE,
  passReqToCallback: true
}, (req, accessToken, refreshToken, profile, done) => {
  const email = profile.emails[0].value;
  const password = profile.id;

  userModel.findOne({ email: email })
    .then(existingUser => {
      if (existingUser) {
        bcrypt.compare(password, existingUser.password, (err, result) => {
          if (err) {
            req.session.error = 'H-error occurred';
            return done(null, false, { message: 'H-error occurred' });
          }
          if (result) {
            currentUser = existingUser._id.toString();
            currentUserType = existingUser.personType;
            return done(null, existingUser); // Return the user object
          } else {
            req.session.error = 'Username/Password incorrect';
            return done(null, false, { message: 'Username/Password incorrect' });
          }
        });
      } else {
        req.session.error = 'User does not exist';
        return done(null, false, { message: 'User does not exist' });
      }
    })
    .catch(err => {
      return done(err);
    });
}));

//passport for signup
// passport.use("googleSignUp",new GoogleStrategy({
//   clientID: process.env.SIGN_UP_CLIENT_ID,
//   clientSecret: process.env.SIGN_UP_CLIENT_SECRET ,
//   callbackURL: "http://localhost:5000/callbackSignUp",
//   userProfileURL: process.env.USER_PROFILE,
//   passReqToCallback: true
// }, (req, accessToken, refreshToken, profile, done) => {
//   const email = profile.emails[0].value;
//   const password = profile.id;
//   const name = profile.displayName;
//   const userType = req.session.userType;
//   userModel.findOne({ email: email })
//     .then(existingUser => {
//       if (existingUser) {
//         req.session.error =  'User/Email already exists';
//         return done(null, false, { message: 'User/Email already exists' });
//       } else {
//         bcrypt.hash(password,saltRounds,(err,hashPassword)=>{
//           if(err){
//             res.json({ message: 'H-Error occurred' })
//           }else{
//             userModel.create({
//               username: name,
//               password: hashPassword,
//               email:email,
//               personType:userType
//             }).then(result => {
//                 return done(null,email);
//                 // res.json({ message: 'User created successfully' });
//               }
//               )
//               .catch(err => {
//                 return done(err);
//               });
              
//           }
//         })
//       }
//     })
//     .catch(err => {
//       return done(err);
//     });
// }));
passport.use("googleSignUp", new GoogleStrategy({
  clientID: process.env.SIGN_UP_CLIENT_ID,
  clientSecret: process.env.SIGN_UP_CLIENT_SECRET,
  callbackURL: "http://localhost:5000/callbackSignUp",
  userProfileURL: process.env.USER_PROFILE,
  passReqToCallback: true
}, (req, accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    const password = profile.id;
    const name = profile.displayName;
    const userType = req.session.userType;

    userModel.findOne({ email: email })
      .then(existingUser => {
        if (existingUser) {
          req.session.error = 'User/Email already exists';
          return done(null, false, { message: 'User/Email already exists' });
        } else {
          bcrypt.hash(password, saltRounds, (err, hashPassword) => {
            if (err) {
              return done(err);
            } else {
              userModel.create({
                username: name,
                password: hashPassword,
                email: email,
                personType: userType
              }).then(newUser => {
                return done(null, newUser);
              }).catch(err => {
                return done(err);
              });
            }
          });
        }
      })
      .catch(err => {
        return done(err);
      });
  } catch (error) {
    console.error('Error in Google Signup Strategy:', error);
    done(error);
  }
}));


passport.serializeUser((user, done) => {
  if (user && user._id) {
    currentUser = user._id.toString(); // Store user ID as string in currentUser
    done(null, user._id);
  } else {
    done(new Error("User object or user._id is undefined"));
  }
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findById(id);
    if (user) {
      currentUser = user._id.toString(); // Set currentUser upon deserialization
      done(null, user);
    } else {
      done(new Error("User not found"));
    }
  } catch (err) {
    done(err);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
