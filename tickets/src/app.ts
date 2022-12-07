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
import { indexTicketRouter } from "./routes";
import { updateTicketRouter } from "./routes/update";

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
app.use(indexTicketRouter);
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(updateTicketRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };