const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");

module.exports = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log("🧑‍💻 Google full profile:", profile);

        try {
          let existingUser = await User.findOne({
            provider: "google",
            providerId: profile.id,
          });

          if (existingUser) {
            
            if (!existingUser.avatar && profile._json?.picture) {
              existingUser.avatar = profile._json.picture;
              await existingUser.save();
            }
            return done(null, existingUser);
          }

          
          const newUser = await User.create({
            provider: "google",
            providerId: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0]?.value || "",
            avatar:
              profile._json?.picture || 
              profile.photos?.[0]?.value ||
              "",
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
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
