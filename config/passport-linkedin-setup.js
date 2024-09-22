const passport = require('passport');
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

passport.use(new LinkedInStrategy({
    clientID: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    callbackURL: "http://localhost:4000/auth/linkedin/callback",
    scope: ['email', 'profile', 'openid', 'w_member_social'],
    state: true // Re-enable after troubleshooting
  }, function(request, accessToken, refreshToken, profile, done) {
    console.log('Request:', request); // Log the incoming request object
    console.log('Access token:', accessToken);
    console.log('Refresh token:', refreshToken);
    console.log('LinkedIn profile:', profile); // Debug to verify profile data
    return done(null, profile); // Pass the full profile
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
