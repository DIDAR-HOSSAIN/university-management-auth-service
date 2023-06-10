import express, { Application } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import { UserRoutes } from './app/modules/user/user.route';

const app: Application = express();
app.use(cors());

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/users/', UserRoutes);

// // Testing route
// app.get('/', async(req: Request, res: Response, next: NextFunction) => {
//   throw new Error('Testing Error logger')
// })

// Global Error handler
app.use(globalErrorHandler);

export default app;
