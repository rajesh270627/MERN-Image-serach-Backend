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


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));


app.use(cookieSession({
  name: 'session',
  keys: [process.env.SESSION_SECRET || 'defaultsecret'],
  maxAge: 24 * 60 * 60 * 1000 // 1 day
}));


app.use((req, res, next) => {
  if (req.session && !req.session.regenerate) req.session.regenerate = (cb) => cb();
  if (req.session && !req.session.save) req.session.save = (cb) => cb();
  next();
});

app.use(passport.initialize());
app.use(passport.session());


app.use('/auth', googleRoutes);
app.use('/auth', facebookRoutes);
app.use('/auth', githubRoutes);
app.use('/api', apiRoute);

app.get('/data-deletion', (req, res) => {
  res.json({
    message: 'User data deletion request received.',
    instructions: 'To delete your data, remove the app from your Facebook settings or contact support@example.com.'
  });
});


app.get('/', (req, res) => res.send('Auth server running ✅'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
