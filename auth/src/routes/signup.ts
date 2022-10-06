import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { User } from '../models/user';
import { validateRequest } from '../middlewares/validate-request';
import jwt from 'jsonwebtoken';

import { validateBody } from '../middlewares/validate-body';

const validationType = validateBody(['email', 'passwordSignup']);

const router = express.Router();

router.post('/api/users/signup',validationType, validateRequest, async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = User.build({ email, password });
    await user.save();

    //Generate JSON Web Token
    const userJwt = jwt.sign({
      id: user.id,
      email: user.email
    }, process.env.JWT_KEY!);

    // Store it on session object
    req.session = {
      jwt: userJwt
    };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
