import { Message } from "node-nats-streaming";
import { Subjects, PaymentCreatedEvent, Listener } from "@sitehub-website/common/build";
import { OrderStatus } from "@sitehub-website/common/build";
import { Order } from "../../models/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  queueGroupName = process.env.NATS_QUEUEGROUP_NAME!;
  async onMessage (data: PaymentCreatedEvent['data'], msg: Message) {
    const { id, orderId, stripeId } = data;
    const order = await Order.findById(orderId);

    if(!order) {
      throw new Error('Order not found');
    }

    order.set({ status: OrderStatus.Complete });

    await order.save();

    msg.ack();
  };
};