import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from 'cookie-session';

import { errorHandler } from '@sitehub-website/common/build/';
import { NotFoundError } from '@sitehub-website/common/build/';
import { currentUser } from "@sitehub-website/common/build/";

//routes
import { createTicketRouter } from "./routes/new";
import { showTicketRouter } from "./routes/show";

const app = express();
app.use(json());

app.use(
  cookieSession({
    signed: false,
    httpOnly: false
  })
);

app.use(currentUser);

//routes handlers config
app.use(createTicketRouter);
app.use(showTicketRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };