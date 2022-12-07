import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app).put(`/api/tickets/${id}`).set('Cookie', global.signin()).send({
    title: 'Super Bowl',
    price: 20
  }).expect(404);

});

it('returns a 401 if user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app).put(`/api/tickets/${id}`).send({
    title: 'Super Bowl',
    price: 20
  }).expect(401);
  
});

it('returns a 401 if the user does not own the ticket', async () => {
  const response = await request(app).post('/api/tickets').set('Cookie', global.signin()).send({
    title: "Final World Cup",
    price: 200
  });

  await request(app).put(`/api/tickets/${response.body.id}`).set('Cookie', global.signin()).send({
    title: 'Super Bowl',
    price: 40
  }).expect(401);

});

it('returns a 400 if the user provides an invalid title or price', async () => {
  const cookie = global.signin()

  const response = await request(app).post('/api/tickets').set('Cookie', cookie).send({
    title: "Final World Cup",
    price: 200
  });

  await request(app).put(`/api/tickets/${response.body.id}`).set('Cookie', cookie).send({
    title: '',
    price: 40
  }).expect(400);

  await request(app).put(`/api/tickets/${response.body.id}`).set('Cookie', cookie).send({
    title: 'Final World Cup',
    price: -10
  }).expect(400);

});

it('updates the tickets provided valid inputs', async () => {
  const cookie = global.signin()

  const response = await request(app).post('/api/tickets').set('Cookie', cookie).send({
    title: "Final World Cup",
    price: 200
  });

  await request(app).put(`/api/tickets/${response.body.id}`).set('Cookie', cookie).send({
    title: "Super Bowl",
    price: 100
  }).expect(200);

  const ticketResponse = await request(app).get(`/api/tickets/${response.body.id}`).send();

  expect(ticketResponse.body.title).toEqual('Super Bowl');
  expect(ticketResponse.body.price).toEqual(100);

});