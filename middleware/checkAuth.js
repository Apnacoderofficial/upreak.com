const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const checkAuth = (req, res, next) => {
  try {
    // Check if the user is logged in via session
    if (req.cookies && req.cookies.isLoggedIn) {
      return next();
    }

    // If no session, check the token in cookies
    const token = req.cookies.token;

    if (!token) {
      // If no token is present, respond with unauthorized access
      console.log({ message: 'Unauthorized access & token does not exist' });
      return res.redirect('/'); // Ensure to return here
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the token has expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      console.log({ message: 'Unauthorized access, token expired' });
      return res.redirect('/'); // Ensure to return here
    }

    // Attach the decoded token data to the request object
    req.user = decoded;

    // If token is valid and not expired, allow access to the next middleware or route handler
    next();
  } catch (error) {
    // Handle specific JWT errors
    if (error.name === 'TokenExpiredError') {
      console.log({ message: 'Unauthorized access, token expired' });
      return res.redirect('/');
    } else if (error.name === 'JsonWebTokenError') {
      console.log({ message: 'Unauthorized access, invalid token' });
      return res.redirect('/');
    } else {
      // General error handling
      console.log('Error verifying token');
      return res.redirect('/');
    
    }
  }
};

const userData = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    console.log({ message: 'Token not found, setting user as null' });
    res.locals.user = null; // Set user to null if token is not present
    return next(); // Continue to the next middleware or route
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the token has expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      console.log({ message: 'Token expired, setting user as null' });
      res.locals.user = null; // Set user to null if token is expired
      return next(); // Continue to the next middleware or route
    }

    // Attach the decoded token data to res.locals
    res.locals.user = decoded.data; // User data from token
    // console.log(decoded.data);
    

    next(); // Continue to the next middleware or route
  } catch (error) {
    console.log('Error verifying token in userData:', error);
    res.locals.user = null; // Set user to null in case of verification error
    next(); // Continue to the next middleware or route
  }
};


module.exports = { checkAuth,userData };
