import express, { Request, Response} from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validate-request';

import { validateBody } from '../middlewares/validate-body';

const validationType = validateBody(['email', 'passwordSignin']);

const router = express.Router();

router.post('/api/users/signin', validationType , validateRequest, (req: Request, res: Response) => {
  res.send('Hi there!');
});

export { router as signinRouter };
