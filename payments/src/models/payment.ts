import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { OrderDoc } from "./order";

interface PaymentAttrs {
  order: OrderDoc;
  stripeId: string;
};

interface PaymentDoc extends mongoose.Document {
  order: OrderDoc;
  stripeId: string;
  version: number;
};

interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attrs:PaymentAttrs): PaymentDoc;
};

const paymentSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  order: { type: String, default: uuidv4, ref: 'Order'},
  stripeId: {
    type: String
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

paymentSchema.set('versionKey', 'version');
paymentSchema.plugin(updateIfCurrentPlugin);

paymentSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment({
    _id: uuidv4(),
    order: attrs.order,
    stripeId: attrs.stripeId
  });
}

const Payment = mongoose.model<PaymentDoc, PaymentModel>('Payment', paymentSchema);

export { Payment };


