import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';
import {v4 as uuidv4 } from 'uuid';

it('marks an order as cancelled', async () => {
  const ticket = Ticket.build({
    id: uuidv4(),
    title: 'New concert',
    price: 20
  });

  await ticket.save();

  const user = global.signin();

  const { body: order } = await request(app)
                                .post('/api/orders')
                                .set('Cookie', user)
                                .send({ ticketId: ticket.id })
                                .expect(201)

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .expect(204);

  const { body: orderCancelled } = await request(app)
                                        .get(`/api/orders/${order.id}`)
                                        .set('Cookie', user)
                                        .expect(200);

  expect(orderCancelled.status).toEqual('cancelled');
});

it('emits a order cancelled event', async () => {

  const ticket = Ticket.build({
    id: uuidv4(),
    title: 'New concert',
    price: 20
  });

  await ticket.save();

  const user = global.signin();

  const { body: order } = await request(app)
                                .post('/api/orders')
                                .set('Cookie', user)
                                .send({ ticketId: ticket.id })
                                .expect(201)

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .expect(204);

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .expect(200);
    
  expect(natsWrapper.client.publish).toHaveBeenCalled();

});