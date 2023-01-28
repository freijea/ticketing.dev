import { OrderCancelledEvent } from "@sitehub-website/common/build";
import { natsWrapper } from "../../nats-wrapper";
import { OrderCancelledListener } from "../publisher/listeners/order-cancelled-listener";
import { OrderStatus } from "@sitehub-website/common/build";
import { Ticket } from "../../models/tickets";
import { v4 as uuidv4 } from "uuid";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const ticket = Ticket.build({
    title: 'new concert',
    price: 20,
    userId: 'asdf'
  });

  await ticket.save();

  const data: OrderCancelledEvent['data'] = {
    id: uuidv4(),
    version: 0,
    ticket: {
      id: ticket.id
    }
  };

  const orderId = data.id;

    // @ts-ignore
    const msg: Message = {
      ack: jest.fn()
    };
  
    return { listener, ticket, data, msg, orderId };

};

it('updates the ticket, publishes an event, and acks the message', async () => {

  const { listener, ticket, data, msg, orderId } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();

})