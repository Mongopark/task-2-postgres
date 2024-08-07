import express, { json } from 'express';
import cors from 'cors';
import usersRouter from './routes/users-routes.js';
import authRouter from './routes/auth-routes.js';
import organisationRouter from './routes/organisations-routes.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 5000;

// Allow all origins
const corsOptions = { credentials: true, origin: '*' };

app.use(cors(corsOptions));
app.use(json());
app.use(cookieParser());

app.use('/', express.static(join(__dirname, 'public')));
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/organisations', organisationRouter);

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
