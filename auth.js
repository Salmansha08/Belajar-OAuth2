const passport  = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const OAuth2Strategy = require('passport-oauth2').Strategy;

require('dotenv').config();

// GOOGLE
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback",
      passReqToCallback: true
    },
    function(request, accessToken, refreshToken, profile, done) {
      done(null, profile);
    },
    /*
    function(request, accessToken, refreshToken, profile, done) {
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return done(err, user);
      });
    }
    */
  )
);

//GITHUB
passport.use(
  new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/github/callback"
  },
  function(request, accessToken, refreshToken, profile, done) {
    done(null, profile);
  },
  /*
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ githubId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
  */
));

passport.use(
  new OAuth2Strategy({
    authorizationURL: 'https://my.idcloudhost.com/oauth/authorize.php',
    tokenURL: 'https://my.idcloudhost.com/oauth/token.php',
    clientID: process.env.IDCH_CLIENT_ID,
    clientSecret: process.env.IDCH_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/oauth2/callback"
  },
  function(request, accessToken, refreshToken, profile, done) {
    done(null, profile);
  },
  /*
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ exampleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
  */
));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});
