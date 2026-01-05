const express = require('express');
const passport = require('passport');
const {
    register,
    login,
    logout,
    refreshToken,
    googleCallback,
    googleLoginSuccess,
    googleLoginFailed,
    forgotPassword,
    resetPassword
} = require('../controllers/auth.controller');

const authRouter = express.Router();

// Local Auth
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/refresh-token', refreshToken);

// Google OAuth
authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

authRouter.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/api/auth/google/failed',
        session: true, // cần có vì mình config passport session
    }),
    googleCallback
);

// Handle Login Success
authRouter.get('/google/success', googleLoginSuccess);

// Handle Login Failed
authRouter.get('/google/failed', googleLoginFailed);

authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/reset-password', resetPassword);

module.exports = authRouter;
