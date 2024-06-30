const passport = require('passport'); 
const GoogleStrategy = require('passport-google-oauth20').Strategy; 

const googleStrategy = new GoogleStrategy(
	{ 
	clientID: '284537906431-qfto5t74n0r0k0ijskl56jbak83f9g3e.apps.googleusercontent.com', // Your Credentials here. 
	clientSecret: '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', // Your Credentials here. 
	callbackURL:"https://upreak.com/auth/google/callback", 
	passReqToCallback:true
	}, 
	(profile, done) => { 
		return done(null, profile); 
	} 
);

passport.use(googleStrategy);

passport.serializeUser((user , done) => { 
	done(null , user); 
}) 
passport.deserializeUser(function(user, done) { 
	done(null, user); 
}); 

module.exports = { passport, googleStrategy };