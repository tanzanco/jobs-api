require('dotenv').config();
require('express-async-errors');

// Extra security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

const express = require('express');
const app = express();

// ConnectDB
const connectDB = require('./db/connect');
const authenticateUser = require('./middleware/authentication');



// Routers
const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');


// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
app.set('trust proxy', 1);
app.use(rateLimiter({
  windows: 15 * 60 * 1000,
  max: 100
}));
app.use(express.json());
ap.use(helmet());
app.use(cors());
app.use(xss());
// extra packages

// routes
app.use('/api/v1/auth',authRouter);
app.use('/api/v1/jobs',authenticateUser,jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
