import { OrderCancelledEvent, OrderStatus } from "@sitehub-website/common/build";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { v4 as uuidv4 } from "uuid";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = Order.build({
    id: uuidv4(),
    price: 10,
    status: OrderStatus.Created,
    userId: 'kksksksks',
    version: 0
  });

  await order.save();

  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    ticket: {id: uuidv4()},
    version: 1
  };

  //@ts-ignore
  const msg: Message = {
      ack: jest.fn()
  };

  return { listener, data, msg, order }

};

it('find the appropriate order and update the status', async () => {
  const { listener, data, msg, order } = await setup();

  await listener.onMessage(data, msg);

  const existingOrder = await Order.findById(order.id);
  expect(existingOrder!.status).toEqual(OrderStatus.Cancelled);

});

it('ack the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();

});