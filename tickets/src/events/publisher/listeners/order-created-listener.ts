import { Message } from "node-nats-streaming";
import { Listener, OrderCreatedEvent, Subjects } from "@sitehub-website/common/build";
import { Ticket } from "../../../models/tickets";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = process.env.NATS_QUEUEGROUP_NAME!;
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new Error('Ticket not found!');
    };

    ticket.set({ orderId: data.id });
    await ticket.save();

    msg.ack();
  };
};