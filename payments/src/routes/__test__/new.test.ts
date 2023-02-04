import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/order";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";
import { OrderStatus } from "@sitehub-website/common/build";
import { stripe } from '../../stripe';

jest.mock('../../stripe');

it('turns a 404 when purchasing an order that doesnt exit', async () => {
  await request(app).post('/api/payments').set('Cookie', global.signin()).send({
    token: 'kakakaka',
    orderId: uuidv4()
  }).expect(404);

});


it('turns a 401 when purchasing an order that doesnt belongs to the user', async () => {
  const order = Order.build({
    id: uuidv4(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created
  });

  await order.save();

  await request(app).post('/api/payments').set('Cookie', global.signin()).send({
    token: 'kakakaka',
    orderId: order.id
  }).expect(401);

});


it('turns a 400 when purchasing an cancelled order', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: uuidv4(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled
  });

  await order.save();

  await request(app).post('/api/payments').set('Cookie', global.signin(userId)).send({
    token: 'kakakaka',
    orderId: order.id
  }).expect(400);

});

it('returns a 201 with valid inputs', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: uuidv4(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });

  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      token: 'tok_visa',
      orderId: order.id,
    })
    .expect(201);

  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];

  expect(chargeOptions.source).toEqual('tok_visa');
  expect(chargeOptions.amount).toEqual(order.price * 100);
  expect(chargeOptions.currency).toEqual('brl');

});