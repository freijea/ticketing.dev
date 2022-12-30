import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";

const start = async () => {
  try {

    if(!process.env.JWT_KEY) {
      throw new Error('environment variable is not defined');
    }

    if(!process.env.MONGO_URI) {
      throw new Error ('environment variable is not defined');
    }

    await natsWrapper.connect('ticketing', 'laskf', 'http://nats-srv:4222');
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());
    
    mongoose.set("strictQuery", true);
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
