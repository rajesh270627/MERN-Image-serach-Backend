const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/user");

module.exports = (passport) => {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID, 
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL,
        profileFields: ["id", "displayName", "photos", "email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        
        console.log("🧑‍💻 Facebook full profile:", JSON.stringify(profile, null, 2));

        try {
          let user = await User.findOne({
            provider: "facebook",
            providerId: profile.id,
          });

          if (!user) {
            user = await User.create({
              provider: "facebook",
              providerId: profile.id,
              name: profile.displayName,
              email: profile.emails?.[0]?.value || "",
              avatar: profile.photos?.[0]?.value || "",
            });
          }

          done(null, user);
        } catch (err) {
          console.error("❌ Error saving Facebook user:", err);
          done(err, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .then((user) => done(null, user))
      .catch((err) => done(err, null));
  });
};
