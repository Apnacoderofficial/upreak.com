const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
var flash = require('express-flash');
const db = require("./config/dbconfig");
const { userData } = require('./middleware/checkAuth');
const passport = require('passport');
require('dotenv').config();

const app = express();

app.use(cookieParser());
app.use(sessions({
    secret: process.env.SESSION_SECRET || "default-secret-key",
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production', maxAge: 1000 * 60 * 60 * 24 },
    resave: false 
}));

app.use(flash());
app.set('view engine', 'ejs');
// Initialize Passport and restore authentication state from session
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const file_route = require('./routes/file_route');
const workspace_route = require('./routes/workspace_route');
app.use('/', file_route);
app.use('/myworkspace', workspace_route);
// app.use((req, res, next) => {
//     res.locals.successMessage = req.flash('success') || '';
//     res.locals.errorMessage = req.flash('error') || '';
//     next();
// });
// // Error handling middleware
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).render('500', {
//         error: err,
//         successMessage: req.flash('success') || '',  // Pass empty string if no message
//         errorMessage: req.flash('error') || ''       // Pass empty string if no message
//     });
// });


// Use userData middleware globally
app.use(userData);
app.locals.uploadUrl = process.env.UPLOAD_URL;
// Error handling
app.use((req, res, next) => {
    res.status(404).render('404'); // Customize as needed
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('500'); // Customize as needed
});

let port = process.env.ENVIRONMENT === "Production" ? process.env.PORT : 3000;

app.listen(port, function(){
    console.log("Upreak Server has started on port", port);
});

// Redis integration (if applicable)
// const redisClient = require('./config/redisClient');
// redisClient.once('connect', () => {
//     app.listen(port, () => {
//         console.log(`Upreak Server is running on port ${port}`);
//     });
// });

// redisClient.on('error', (err) => {
//     console.error('Error connecting to Redis:', err);
//     process.exit(1);
// });
