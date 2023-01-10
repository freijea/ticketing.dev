import { Message } from "node-nats-streaming";
import { Subjects, TicketCreatedEvent, Listener } from "@sitehub-website/common/build";
import { Ticket } from "../../models/ticket";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = process.env.NATS_QUEUEGROUP_NAME!;
  async onMessage (data: TicketCreatedEvent['data'], msg: Message) {
    const { title, price, id } = data;
    const ticket = Ticket.build({
      id, title, price
    });

    await ticket.save();

    msg.ack();
  };
};