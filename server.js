import dotenv from 'dotenv';
dotenv.config();
import morgan from 'morgan';
import cors from 'cors';
import express from 'express'; //after es6
const app = express();

import helmet from 'helmet';
const PORT = process.env.PORT || 8000;

//Connect Mongo DB

import mongoClient from './config/db.js';
mongoClient();

//middlewares
app.use(morgan('tiny'));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

//load routers

import userRouter from './routers/UserRouter.js';

//use routers
app.use('/api/v1/user', userRouter);

app.use('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

app.listen(PORT, (error) => {
  if (error) {
    return console.log(error);
  }

  console.log(`Server is running at http://localhost:${PORT}`);
});
