import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import {v4 as uuidv4 } from 'uuid';

it('fetches a order', async () => {
  const ticket = Ticket.build({
    id: uuidv4(),
    title: 'New Concert',
    price: 20
  });

  await ticket.save();

  const user = global.signin();

  const { body: order } = await request(app)
          .post('/api/orders')
          .set('Cookie', user)
          .send({
            ticketId: ticket.id
          })
          .expect(201);

  const { body: fetchedOrder } =  await request(app)
         .get(`/api/orders/${order.id}`)
         .set('Cookie', user)
         .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);

});


it('returns an error if one user tries to fetch another users order', async () => {
  const ticket = Ticket.build({
    id: uuidv4(),
    title: 'New Concert',
    price: 20
  });

  await ticket.save();

  const user = global.signin();

  const { body: order } = await request(app)
          .post('/api/orders')
          .set('Cookie', user)
          .send({
            ticketId: ticket.id
          })
          .expect(201);

  const newUser = global.signin();
  
  await request(app)
         .get(`/api/orders/${order.id}`)
         .set('Cookie', newUser)
         .expect(401);

});