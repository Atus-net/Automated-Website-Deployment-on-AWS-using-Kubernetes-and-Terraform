const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user.model");

// --- SỬA LỖI CRASH ---
// Chỉ kích hoạt Google Login nếu có key. Nếu không có (môi trường Dev/Docker test) thì bỏ qua.
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || "/api/auth/google/callback",
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ googleId: profile.id });

            if (!user) {
                user = await User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    googleId: profile.id,
                    avatar: profile.photos[0].value,
                });
            }
            return done(null, user);
        } catch (err) {
            return done(err, null);
        }
    }));
} else {
    console.log("⚠️  GOOGLE LOGIN DISABLED: Missing Client ID/Secret in environment variables.");
}

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
}); 