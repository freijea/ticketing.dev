import { Order } from "../order";
import { Ticket } from "../ticket";
import { OrderStatus } from '../../models/order';
import {v4 as uuidv4, validate as uuidv4Validate } from 'uuid';

it('implements uuid', async () => {
  const ticket = Ticket.build({
    id: uuidv4(),
    title: 'NEW CONCERT',
    price: 20
  });

  await ticket.save();

  const order = Order.build({
    userId: 'lsksksks',
    status: OrderStatus.Created,
    ticket,
    expiresAt: new Date()
  });

  await order.save();

  expect(uuidv4Validate(order.id)).toBe(true)

});