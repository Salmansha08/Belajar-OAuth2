const express = require('express');
const session = require('express-session');
const passport = require('passport');

const axios = require('axios');


const path = require('path');
const app = express();
require('dotenv').config();

require('./auth');

app.use(express.json());
app.use(express.static(path.join(__dirname, "client")));


// MAIN PAGE
app.get('/', (req, res) => {
    res.sendFile('index.html');
});

app.use(
    session({
        secret: process.env.mysecretkey,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }
    })
);

app.use(passport.initialize());
app.use(passport.session());

//GOOGLE
function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}

app.get(
    '/auth/google',
    passport.authenticate('google', { 
        scope: [ 'email', 'profile' ]
    })
);

app.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/auth/google/success',
        failureRedirect: '/auth/google/failure'
    })
);

app.get('/auth/google/success', isLoggedIn, (req, res) => {
    let name = req.user.displayName;
    res.send(`Hello ${name}`);
});

app.get('/auth/google/failure', (req, res) => {
    res.send('Gagal Login Google!');
});

app.use('/auth/google/logout', (req, res) => {
    req.session.destroy();
    res.send('Berhasil Logout Google!');
});

//GITHUB
app.get(
    '/auth/github',
    passport.authenticate('github', { 
        scope: [ 'user:email' ]
    })
);

app.get('/auth/github/callback', 
  passport.authenticate('github', {
    successRedirect: '/auth/github/success', 
    failureRedirect: '/auth/github/failure' }),
 
);

app.get('/auth/github/success', isLoggedIn, (req, res) => {
    let name = req.user.displayName;
    res.send(`Hello ${name}`);
});

app.get('/auth/github/failure', (req, res) => {
    res.send('Gagal Login Github!');
});

app.use('/auth/google/logout', (req, res) => {
    req.session.destroy();
    res.send('Berhasil Logout Github!');
});

app.listen(5000, () => {
    console.log("Listening on port 5000. Open http://localhost:5000");
});
