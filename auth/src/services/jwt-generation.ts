import { Request } from 'express';
import jwt from 'jsonwebtoken';

export class JwtManager {
  static async generate(email: string, id: string, req: Request) {

  //Generate JSON Web Token
  const userJwt = jwt.sign({
    id,
    email
  }, process.env.JWT_KEY!);

  // Store it on session object
  req.session = {
    jwt: userJwt
  };
}
};
