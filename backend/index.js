import {PORT, mongoDBURL} from './config.js';
import express from "express";
const app = express();
import connectDB from './db/connect.js';
import helmet from 'helmet';
import cors from 'cors';
import xss from 'xss-clean';
import rateLimiter from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(cors({
  credentials: true,
  origin: 'http://localhost:5173',
}));
app.use(xss());
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

// error handler
import notFoundMiddleware from './middleware/not-found.js'
import errorHandlerMiddleware from './middleware/error-handler.js';

// routers
import authRouter from './routes/auth.js'
import authenticateUser from './middleware/authentication.js'
import textRouter from './routes/text.js';
import User from './models/User.js';

// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/texts', authenticateUser, textRouter);

app.get('/api/v1/profile', (req, res) => {
  const {token} = req.cookies;
  if (token) {
    jwt.verify(token, 'jwtSecret', {}, async (err, user) => {
      if(err) throw err;
      const {name, email, _id} = await User.findById(user.id);
      res.json({name, email, _id});
    })
  } else {
    res.json(null);
  }
})

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = PORT || 1000;

const start = async () => {
  try {
    await connectDB(mongoDBURL);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();