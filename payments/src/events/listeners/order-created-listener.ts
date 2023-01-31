import { Message } from "node-nats-streaming";
import { OrderCreatedEvent, Listener, Subjects } from "@sitehub-website/common/build";
import { Order } from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = process.env.NATS_QUEUEGROUP_NAME!;
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      version: data.version
    });

    await order.save();

    msg.ack();
  }
};