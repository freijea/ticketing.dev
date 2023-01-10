import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { OrderStatus } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';

it('returns an error if the ticket does not exist', async () => {
  const ticketId = await new mongoose.Types.ObjectId();

  await request(app).post('/api/orders').set('Cookie', global.signin()).send({
    ticketId
  }).expect(404);

});

it('return an error if the ticket is reserverd', async () => {
  const ticket = Ticket.build({
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

  const newOrder = await request(app).post('/api/orders').set('Cookie', global.signin()).send({
    ticketId: ticket.id
  }).expect(400);
  
  expect(newOrder.body.errors[0].message).toEqual('Ticket is already reserved')

});

it('reserves a ticket', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20
  });

  await ticket.save();
  
  await request(app).post('/api/orders').set('Cookie', global.signin()).send({
    ticketId: ticket.id
  }).expect(201);

});

it('emits an order created event', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20
  });

  await ticket.save();
  
  await request(app).post('/api/orders').set('Cookie', global.signin()).send({
    ticketId: ticket.id
  }).expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
