require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieSession = require('cookie-session');
const cors = require('cors');

const googleRoutes = require('./routes/googleauthRoutes');
const facebookRoutes = require('./routes/facebookroutes');
const githubRoutes = require('./routes/githubRoutes');
const apiRoute = require('./routes/apiRoutes');

require('./config/Passportgoogle')(passport);
require('./config/passportfacebook')(passport);
require('./config/passportGithub')(passport);

const app = express();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ DB Error:", err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: [
    'http://localhost:3000',
    process.env.CLIENT_ORIGIN
  ],
  credentials: true
}));

app.use(cookieSession({
  name: 'session',
  keys: [process.env.SESSION_SECRET],
  maxAge: 24 * 60 * 60 * 1000
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', googleRoutes);
app.use('/auth', facebookRoutes);
app.use('/auth', githubRoutes);
app.use('/api', apiRoute);

app.get('/', (req, res) => {
  res.send('✅ Backend Running Successfully');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
