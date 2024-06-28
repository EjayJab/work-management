const express = require('express');
const path = require('path');
const fileUpload = require('express-fileupload');
const cookieSession = require('cookie-session');
const mongo = require('./mongoConfig');
const routes = require('./routes/getRoutes');
const events = require('./routes/event');
const restroutes = require('./REST/restRoutes');
const photoroutes = require('./REST/photo');
const jobpoolroutes = require('./REST/jobpool');
const authuser = require('./REST/authuser');
const teams = require('./REST/team');
const tasks = require('./REST/task');
const profileRoutes = require('./REST/profile');

global.appRoot = path.resolve(__dirname);

const app = express();

// Middleware
app.use(fileUpload());
app.use(cookieSession({
  name: 'session',
  keys: ["sathish"],
  maxAge: 48 * 60 * 60 * 1000 // 48 hours
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static('./public'));

// Database connection
mongo();

// Routes
app.use(routes);
app.use(restroutes);
app.use(events);
app.use(authuser);
app.use(jobpoolroutes);
app.use(profileRoutes);
app.use(photoroutes);
app.use(teams);
app.use(tasks);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));
