import { OrderStatus } from "@sitehub-website/common/build";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

interface OrderAttrs {
  id: string;
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
};

export interface OrderDoc extends mongoose.Document {
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
};

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs:OrderAttrs): OrderDoc;
  findByEvent(event: { id: string, version: number }): Promise<OrderDoc | null>;
};

const orderSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  userId: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    required: true
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  }
});


orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id:  attrs.id,
    version: attrs.version,
    userId: attrs.userId,
    price: attrs.price,
    status: attrs.status
  });
};

orderSchema.statics.findByEvent = (event: { id: string, version: number }) => {
  return Order.findOne({
    _id: event.id,
    version: event.version - 1
  });
};


const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };