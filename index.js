const express = require('express');
const session = require('express-session');
const passport = require('passport');
const axios = require('axios');


const path = require('path');
const { stat } = require('fs');
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

function generateRandomState() {
    return Math.random().toString(36).substring(7);
}

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

app.use('/auth/github/logout', (req, res) => {
    req.session.destroy();
    res.send('Berhasil Logout Github!');
});

//IDCH
app.get(
    '/auth/idcloudhost',
    (req, res, next) => {
        const state = generateRandomState(); // Generate a random state value
        req.session.oauth2state = state; // Store the state in the session
        passport.authenticate('oauth2', {
            state: state // Provide the state as a parameter
        })(req, res, next);
    }
);
    
app.get('/auth/idcloudhost/callback', 
    passport.authenticate('oauth2', {
    successRedirect: '/auth/idcloudhost/success', 
    failureRedirect: '/auth/idcloudhost/failure' }),
);
    
app.get('/auth/idcloudhost/success', isLoggedIn, (req, res) => {
    let name = req.user.displayName;
    res.send(`Hello ${name}`);
});
    
app.get('/auth/idcloudhost/failure', (req, res) => {
    res.send('Gagal Login IDCloudHost!');
});
    
app.use('/auth/idcloudhost/logout', (req, res) => {
    req.session.destroy();
    res.send('Berhasil Logout IDCloudHost!');
});

app.listen(5000, () => {
    console.log("Listening on port 5000. Open http://localhost:5000");
});
