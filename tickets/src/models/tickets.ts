import mongoose, { mongo } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import {v4 as uuidv4 } from 'uuid';

interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number;
};

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
};

const ticketSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  userId: {
    type: String,
    required: true
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
});

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket({
    _id: uuidv4(),
    title: attrs.title,
    price: attrs.price,
    userId: attrs.userId
  });
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export {Ticket};

