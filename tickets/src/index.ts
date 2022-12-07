import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  try {

    if(!process.env.JWT_KEY) {
      throw new Error('environment variable is not defined');
    }

    if(!process.env.MONGO_URI) {
      throw new Error ('environment variable is not defined');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDb");

  } catch (err) {
    console.error(err);
  }

  app.listen(3000, ()=>{
    console.log("Listening on port 3000.");
    console.log('I am here in tickets');
  })

};

start();