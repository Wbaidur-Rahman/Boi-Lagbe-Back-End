/*
 * Title: Project initial file
 * Description: Boi Lagbe Web App Back End Initial File
 * Author: Wbaidur Rahman
 * Date: 1/3/2024
 *
 */

// dependencies

// external imports
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

// internel imports
const passport = require('passport');
const { notFoundHandler, errorHandler } = require('./middlewires/common/errorHandler');
const defaultRouter = require('./routers/defaultRouter');
const loginRouter = require('./routers/loginRouter');
const userRouter = require('./routers/userRouter');
const bookRouter = require('./routers/bookRouter');

const app = express();
dotenv.config();

// Enable CORS for all routes
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

// Initialize and configure Passport
require('./config/passport')(passport); // Assuming passport configuration is defined in a separate file

// Middleware to initialize Passport
app.use(passport.initialize());

// database connection
mongoose
    .connect(process.env.MONGO_CONNECTION_STRING)
    .then(() => console.log('Successfully connected to database'))
    .catch((err) => console.log(err));

// request parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// parse cookies
app.use(cookieParser(process.env.COOKIE_SECRET));

// routing setup
app.use('/', defaultRouter);
app.use('/login', loginRouter);
app.use('/users', userRouter);
app.use('/books', bookRouter);

// error handling
// 404 not Found handler
app.use(notFoundHandler);

// common error handler
app.use(errorHandler);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(process.env.PORT, () => {
    console.log(`App is listening on port ${process.env.PORT}`);
});
