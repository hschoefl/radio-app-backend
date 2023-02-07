require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

// import error handler
const { errorHandler } = require('./middleware/errorMiddleware');

// import routers
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const channelRouter = require('./routes/channelRoutes');

const PORT = process.env.PORT || 9000;

const app = express();

// enable cors
app.use(cors());

// enable access logging
app.use(morgan('dev'));

// enable json data
app.use(express.json());

// initialize routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/channel', channelRouter);

// set the error handler
app.use(errorHandler);

// connect to DB
mongoose.set('strictQuery', false);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log('Connected to MongoDB database "radio"');

    // only if DB is connected we can spawn the express server
    app
      .listen(PORT, () => {
        console.log(`Express server is listening on port ${PORT}.`);
      })
      .on('error', (e) => {
        console.log('Can not start express server: ', e.message);
      });
  })
  .catch((error) => {
    console.log(error);
  });
