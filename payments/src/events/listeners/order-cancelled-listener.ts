import { Message } from "node-nats-streaming";
import { OrderCancelledEvent, Subjects, Listener, OrderStatus } from "@sitehub-website/common/build";
import { Order } from "../../models/order";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = process.env.NATS_QUEUEGROUP_NAME!;
  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const order = await Order.findByEvent(data);

    if(!order) {
      throw new Error(`Order not found.`);
    };

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    msg.ack();
    
  };
};
