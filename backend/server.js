const express = require('express');
const cors = require('cors');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
}));

app.use(session({ 
  secret: 'your_session_secret', 
  resave: false, 
  saveUninitialized: false,
  cookie: {
    secure: false,  // set to true if your using https
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    // Here you would typically find or create a user in your database
    return cb(null, profile);
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Auth middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Not authenticated' });
}

// Routes

// Auth routes
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));
  
  app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
      res.redirect('http://localhost:3000');
    });
  
  app.get('/api/check-auth', (req, res) => {
    res.json({ isLoggedIn: req.isAuthenticated() });
  });
  
  app.get('/logout', (req, res) => {
    req.logout(function(err) {
      if (err) { 
        console.error('Logout error:', err);
        return res.status(500).json({ error: 'Failed to logout' }); 
      }
      res.status(200).json({ message: 'Logged out successfully' });
    });
  });

// API routes
app.get('/api/items', (req, res) => {
  res.json({ message: 'GET all items' });
});

app.get('/api/items/:id', (req, res) => {
  res.json({ message: `GET item ${req.params.id}` });
});

app.post('/api/items', isLoggedIn, (req, res) => {
  res.json({ message: 'POST new item', data: req.body });
});

app.put('/api/items/:id', isLoggedIn, (req, res) => {
  res.json({ message: `PUT update item ${req.params.id}`, data: req.body });
});

app.delete('/api/items/:id', isLoggedIn, (req, res) => {
  res.json({ message: `DELETE item ${req.params.id}` });
});

// Protected route example
app.get('/api/protected', isLoggedIn, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});