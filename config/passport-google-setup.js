const passport = require('passport'); 
const GoogleStrategy = require('passport-google-oauth20').Strategy; 
require('dotenv').config();

passport.serializeUser((user, done) => { 
    done(null, user); // Store the full user profile object in the session
}); 

passport.deserializeUser((user, done) => {
    done(null, user); // Retrieve the full user profile object from the session
});
 

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.BASE_URL + "auth/google/callback",
    passReqToCallback: true,
    scope: ['profile', 'email']
}, function(request, accessToken, refreshToken, profile, done) {
    // console.log('Google profile:', profile); // Check the profile data
    return done(null, profile); // Pass the full profile object
}));



