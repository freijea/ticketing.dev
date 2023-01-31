import { OrderCreatedEvent, OrderStatus } from "@sitehub-website/common/build";
import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { v4 as uuidv4 } from "uuid";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order";

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);
  const data: OrderCreatedEvent['data'] = {
    id: uuidv4(),
    ticket: {id: uuidv4(), price: 10},
    status: OrderStatus.Created,
    userId: 'kksksksks',
    version: 0,
    expiresAt: 'ssksksksk'
  };

  //@ts-ignore
  const msg: Message = {
      ack: jest.fn()
  };

  return { listener, data, msg }

};

it('creates and saves a order', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);
  expect(order).toBeDefined();
  expect(order!.price).toEqual(data.ticket.price);
  expect(order!.userId).toEqual(data.userId);
  expect(order!.status).toEqual(data.status);
  expect(order!.version).toEqual(data.version);
  expect(order!.id).toEqual(data.id);

});

it('ack the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();

});