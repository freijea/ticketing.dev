import { Subjects, Listener, ExpirationCompleteEvent } from "@sitehub-website/common/build";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";
import { OrderStatus } from "@sitehub-website/common/build";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
  queueGroupName = process.env.NATS_QUEUEGROUP_NAME!;

  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId).populate('ticket');

    if(!order) {
      throw new Error("Order not found.");
    };

    if(order.status === OrderStatus.Complete) {
      return msg.ack();8
    }

    order.set({
      status: OrderStatus.Cancelled
    });

    await order.save();

    new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id
      }
    });

    msg.ack();
  };
}