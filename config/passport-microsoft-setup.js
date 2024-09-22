// // passport-microsoft-setup.js
// require('dotenv').config();
// const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;
// const passport = require('passport');

// passport.use(new OIDCStrategy({
//   identityMetadata: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/v2.0/.well-known/openid-configuration`,
//   clientID: process.env.MICROSOFT_CLIENT_ID,
//   responseType: 'code',
//   responseMode: 'query',
//   redirectUrl: process.env.BASE_URL+'auth/microsoft/callback',
//   allowHttpForRedirectUrl: true,
//   clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
//   validateIssuer: false,
//   passReqToCallback: false,
//   scope: ['profile', 'email', 'offline_access'],
//   loggingLevel: 'info'
// }, (iss, sub, profile, accessToken, refreshToken, done) => {
//   return done(null, profile);
// }));


// passport.serializeUser((user, done) => {
//   done(null, user);
// });

// passport.deserializeUser((user, done) => {
//   done(null, user);
// });
