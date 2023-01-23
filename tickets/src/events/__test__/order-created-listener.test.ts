import { OrderCreatedEvent } from "@sitehub-website/common/build";
import { OrderStatus } from "@sitehub-website/common/build";
import { OrderCreatedListener } from "../publisher/listeners/order-created-listener";
import { natsWrapper } from "../../nats-wrapper";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/tickets";
import { v4 as uuidv4 } from "uuid";

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    title: 'new concert',
    price: 20,
    userId: 'asdf'
  });

  await ticket.save();

  const data: OrderCreatedEvent['data'] = {
    id: uuidv4(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'kakskaksks',
    expiresAt: 'kakakhj',
    ticket: {
      id: ticket.id,
      price: ticket.price
    }
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return {  listener, ticket, data, msg };

};

it('sets the userId of the ticket', async () => {
  const { listener, data, ticket, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);

});

it('acks the message', async () => {
  const { listener, data, ticket, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});