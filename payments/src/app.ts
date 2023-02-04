import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from 'cookie-session';

import { errorHandler } from '@sitehub-website/common/build/';
import { NotFoundError } from '@sitehub-website/common/build/';
import { currentUser } from "@sitehub-website/common/build/";

import { createChargeRouter } from "./routes/new";
import { create } from "ts-node";

const app = express();
app.use(json());

app.use(
  cookieSession({
    signed: false,
    httpOnly: false
  })
);

app.use(currentUser);

app.use(createChargeRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };