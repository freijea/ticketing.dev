import express, { Request, Response } from 'express';
import { User } from '../models/user';
import { validateRequest } from '../middlewares/validate-request';
import { JwtManager  } from '../services/jwt-generation';

import { validateBody } from '../middlewares/validate-body';

const validationType = validateBody(['email', 'passwordSignup']);

const router = express.Router();

router.post('/api/users/signup',validationType, validateRequest, async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = User.build({ email, password });
    await user.save();

    const id = user._id;

    JwtManager.generate(email, id, req);

    res.status(201).send(user);
  }
);

export { router as signupRouter };
