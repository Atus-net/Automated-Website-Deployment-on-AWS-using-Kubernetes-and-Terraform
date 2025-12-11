const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const apiRoutes = require('../routes/api');
require('../configs/passport.config');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

// Config session cho PassportJS
app.use(session({
  name: 'connect.sid',
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    httpOnly: true,
    sameSite: 'none',   // hoặc 'none' nếu frontend khác domain
    secure: true     // true nếu dùng HTTPS
  }
}));


// Initialize Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api', apiRoutes);

// Handle 404
app.use((req, res, next) => {
  res.status(404).json({ message: "API not found" });
});

module.exports = app;