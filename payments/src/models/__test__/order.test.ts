import { Order } from "../order";
import {v4 as uuidv4, validate as uuidv4Validate } from 'uuid';
import { OrderStatus } from "@sitehub-website/common/build";

it('implements uuid', async () => {
  const order = Order.build({
    id: uuidv4(),
    version: 0,
    userId: 'ksksksks',
    price: 20,
    status: OrderStatus.AwaitingPayment
  });

  await order.save();

  expect(uuidv4Validate(order.id)).toBe(true);
});