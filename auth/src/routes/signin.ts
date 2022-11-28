import express, { Request, Response} from 'express';
import { validateRequest } from '@sitehub-website/common/build';

import { validateBody } from '@sitehub-website/common/build';
import { BadRequestError } from '@sitehub-website/common/build';

import { JwtManager  } from '../services/jwt-generation';
import { Password } from '../services/password';
import { User } from '../models/user';

const validationType = validateBody(['email', 'passwordSignin']);

const router = express.Router();

router.post('/api/users/signin', validationType , validateRequest, async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if(!existingUser) {
    throw new BadRequestError('You provide invalid credentials');
  };

  const passwordsMatch = await Password.compare(existingUser.password, password);

  if(!passwordsMatch) {
    throw new BadRequestError('You provide invalid credentials');
  };

  const id = existingUser._id;

  JwtManager.generate(email, id, req);

  res.status(200).send(existingUser);

});

export { router as signinRouter };
