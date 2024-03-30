import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { default as mongoose } from 'mongoose';
import type { ValidationError } from 'express-validator';

import helmet from 'helmet';
import CustomError from './utils/CustomError';
import type { Request, Response } from 'express';
import { statusCode } from './utils/statusCode';
const { PORT, MONGO_URI_LOCAL, DB_NAME } = process.env;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());

app.get('/', (_req, res) => {
  res.status(statusCode.OK).send('Hello, world!');
  // res.status(statusCode.OK).json({ message: 'Hello, world!' });
});
app.use((error: CustomError, _req: Request, res: Response) => {
  console.log(error.stack);
  const errorResponse: {
    message: string;
    validationErrors?: ValidationError[];
  } = {
    message: error.message,
  };
  const status = error.statusCode || statusCode.INTERNAL_SERVER_ERROR;
  if (error.validationErrors) {
    errorResponse.validationErrors = error.validationErrors;
  }

  res.status(status).json(errorResponse);
});

mongoose
  .connect(MONGO_URI_LOCAL as string, { dbName: DB_NAME })
  .then(async (mongo) => {
    console.log('Connected to MongoDB');
    console.log(mongo.connection.readyState);
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
