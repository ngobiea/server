import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import CustomError from './utils/CustomError';
import type { Request, Response } from 'express';
import { statusCode } from './utils/statusCode';
const { PORT } = process.env;
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
  const status = error.statusCode || statusCode.INTERNAL_SERVER_ERROR;
  const { message } = error;
  const validationErrors = error.validationErrors;
  res.status(status).json({ message, validationErrors });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
