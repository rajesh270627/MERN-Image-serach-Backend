const express = require('express');
const passport = require('passport');
const router = express.Router();


router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/auth/failure', session: true }),
  (req, res) => {
    res.redirect(process.env.CLIENT_ORIGIN || 'http://localhost:3000');
  }
);


router.get('/logout', (req, res) => {
  req.logout(() => {});
  req.session = null;
  res.redirect(process.env.CLIENT_ORIGIN || 'http://localhost:3000');
});


router.get('/current_user', (req, res) => {
  if (!req.user) return res.json(null);
  const { _id, name, email, avatar, provider } = req.user;
  res.json({ id: _id, name, email, avatar, provider });
});

module.exports = router;
