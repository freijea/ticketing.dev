import { Message } from "node-nats-streaming";
import { Subjects, TicketUpdatedEvent, Listener } from "@sitehub-website/common/build";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = process.env.NATS_QUEUEGROUP_NAME!;
  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const { id, title, price } = data;
    const ticket = await Ticket.findByEvent(data);
    
    if(!ticket) {
      throw new Error('Ticket not found');
    };

    ticket.set({ title, price });
    await ticket.save();

    await msg.ack();
  };

}