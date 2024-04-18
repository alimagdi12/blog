const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors')
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();
const port = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/posts')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// const corsOptions = {
//   origin: "http://localhost:3000",
//   credentials: true, // enable credentials
// };
app.use(cors());





app.use(authRoutes);
app.use(userRoutes);
app.use(postRoutes);





mongoose
  .connect(MONGODB_URI)
  .then(result => {
    app.listen(port);
    console.log(`server is running on port ${port}`)
  })
  .catch(err => {
    console.log(err);
});