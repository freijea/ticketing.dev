import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from 'cookie-session';

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler } from '@sitehub-website/common/build/';
import { NotFoundError } from '@sitehub-website/common/build/';

const app = express();
app.use(json());

app.use(
  cookieSession({
    signed: false,
    httpOnly: false
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };