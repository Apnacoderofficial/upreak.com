const jwt = require('jsonwebtoken');

const generateAccessToken = (payload) => {
  console.log(payload);
  
    const token = jwt.sign({ data: payload }, process.env.JWT_SECRET , { expiresIn: '30m' });
    return token;
};
  
// cache store
const saveTokenInCookie = (res, token) => {
  // Save the token in the cookies
  res.cookie('token', token, {
      httpOnly: true, // Ensures the cookie is only accessible via HTTP(S) and not by client-side scripts
      secure: false,  // Set to true if you're using HTTPS
      maxAge: 24 * 60 * 60 * 1000 // 1 day expiration
  });

  console.log('Token saved in cookie:', token);
};


  const decodeToken = (token) => {
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        return decodedToken.data;
    } catch (error) {
        console.error('Error decoding token');
        return null;
    }
  };
  module.exports = { generateAccessToken,saveTokenInCookie,decodeToken };
