const express = require('express');
const passport = require('passport');
const router = express.Router();

// 🔹 Facebook OAuth - requesting public profile & email
router.get(
  '/facebook',
  passport.authenticate('facebook', { scope: ['public_profile', 'email'] })
);

// 🔹 Facebook callback route
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/auth/failure',
    successRedirect: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
    session: true,
  })
);


router.get('/logout', (req, res) => {
  req.logout(function () {
    req.session = null;
    res.redirect(process.env.CLIENT_ORIGIN || 'http://localhost:3000');
  });
});


router.get('/failure', (req, res) => {
  res.status(401).json({ message: 'Facebook Login Failed ❌' });
});


router.get('/current_user', (req, res) => {
  if (!req.user) {
    return res.json(null);
  }

  const { _id, name, email, avatar, provider } = req.user;
  res.json({
    id: _id,
    name,
    email,
    avatar,
    provider,
  });
});

module.exports = router;
