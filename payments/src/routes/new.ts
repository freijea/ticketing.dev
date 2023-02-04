import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest, BadRequestError, NotFoundError, NotAuthorizedError } from '@sitehub-website/common/build';
import { OrderStatus } from '@sitehub-website/common/build';
import { stripe } from '../stripe';
import { PaymentCreatedPublisher } from '../events/publishers/payment-create-publisher';
import { natsWrapper } from '../nats-wrapper';

import { Order } from '../models/order';
import { Payment } from '../models/payment';

const router = express.Router();

router.post('/api/payments', requireAuth, [
  body('token').not().isEmpty().withMessage('payment token is required'),
  body('orderId').not().isEmpty().withMessage('orderId is required')
], validateRequest, async (req: Request, res: Response) => {
  const { token, orderId } = req.body;

  const order = await Order.findById(orderId);

  if(!order) {
    throw new NotFoundError();
  }

  if(order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  if(order.status === OrderStatus.Cancelled) {
    throw new BadRequestError('Cannnot pay for an cancelled order');
  };

  const charge = await stripe.charges.create({
    currency: 'brl',
    amount: order.price * 100,
    source: token
  });

  const payment = Payment.build({
    order: orderId,
    stripeId: charge.id
  });

  await payment.save();

  await new PaymentCreatedPublisher(natsWrapper.client).publish({
    id: payment.id,
    orderId: (await payment.populate('order')).order.id,
    stripeId: payment.stripeId
  });

  res.status(201).send({ id: payment.id });

});

export { router as createChargeRouter };


