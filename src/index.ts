import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import SequelizeDB from './db/SequelizeDB';
import CustomError from './utils/CustomError';
import type { Request, Response } from 'express';
import { statusCode } from './utils/statusCode';
import type { ValidationError } from 'express-validator';
const { PORT } = process.env;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());

app.get('/', (_req, res) => {
  // res.status(statusCode.OK).send('Hello, world!');
  res.status(statusCode.OK).json('Hello, world!');
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

SequelizeDB.authenticate()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
    SequelizeDB.sync({ force: true });
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });
