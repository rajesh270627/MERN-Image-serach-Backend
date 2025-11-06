const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/user');

module.exports = (passport) => {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
        scope: ['user:email'],
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log("🐱‍💻 GitHub full profile:", profile);

        try {
          let existingUser = await User.findOne({
            provider: 'github',
            providerId: profile.id,
          });

          if (existingUser) return done(null, existingUser);

          const newUser = await User.create({
            provider: 'github',
            providerId: profile.id,
            name: profile.displayName || profile.username,
            email: profile.emails?.[0]?.value || '',
            avatar: profile.photos?.[0]?.value || '',
          });

          done(null, newUser);
        } catch (err) {
          done(err, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
  });
};
