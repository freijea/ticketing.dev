import { body } from 'express-validator';

const validations = {
  email: body('email')
                .isEmail()
                .withMessage('Email must be valid'),
  passwordSignup: body('password')
                  .trim()
                  .isLength({ min: 4, max: 20 })
                  .withMessage('Password must be between 4 and 20 characters'),
  passwordSignin: body('password')
                  .trim()
                  .notEmpty()
                  .withMessage('You must provide a password')
}
export const validateBody = (validationRequest: Array<any>) => {
  let validationArray = [];

  for( let [key, value] of Object.entries(validations)) {
    if(validationRequest.indexOf(key) > -1) {
      validationArray.push(value);
    }
  }
  return validationArray;
}