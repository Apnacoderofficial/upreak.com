const express = require("express");
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
var flash = require('express-flash');
const db = require("./config/dbconfig");
// const winston = require("./config/winston");

require('dotenv').config();



const app = express();

// app.use(morgan('combined', { stream: winston.stream }));

app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:false,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 },
    resave: false 
}));

app.use(flash());


app.set('view engine', 'ejs');

app.use(express.static("public"));
app.use('/uploads',express.static("uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
require("./routes/file_route")(app);

let port;

if (process.env.ENVIRONMENT === "Production") {
    port = process.env.PORT;
} else {
    port = 3000;
}   

app.listen(port,function(){
    console.log("Upreak Server has started on port",port);
});


// Check if Redis is connected before starting the server
// redisClient.once('connect', () => {
//     // Start your Express server
//     app.listen(port, () => {
//         console.log(`Upreak Server is running on port ${port}`);
//     });
// });

// Handle Redis connection errors
// redisClient.on('error', (err) => {
//     console.error('Error connecting to Redis:', err);
//     process.exit(1); // Exit with non-zero code to indicate failure
// });
