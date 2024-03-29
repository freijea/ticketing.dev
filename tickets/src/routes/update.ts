import express, { Request, Response } from 'express';
import { Ticket } from '../models/tickets';
import { body } from 'express-validator';
import { BadRequestError, validateRequest } from '@sitehub-website/common/build';
import { NotFoundError } from '@sitehub-website/common/build';
import { requireAuth } from '@sitehub-website/common/build';
import { NotAuthorizedError } from '@sitehub-website/common/build';
import { TicketUpdatedPublisher } from '../events/publisher/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put('/api/tickets/:id', requireAuth, [
  body('title').not().isEmpty().withMessage('Title is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be provided and must be greater than 0')
], validateRequest, async (req: Request, res: Response) => {
  const id = req.params.id;

  const ticket = await Ticket.findById(id);

  if (!ticket) {
    throw new NotFoundError();
  };

  if(ticket.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  if(ticket.orderId) {
    throw new BadRequestError('Cannot edit a reserved ticket!');
  }

  ticket.set({
    title: req.body.title,
    price: req.body.price
  })

  await ticket.save();

  new TicketUpdatedPublisher(natsWrapper.client).publish({
    id: ticket.id,
    title: ticket.title,
    price: ticket.price,
    userId: ticket.userId,
    version: ticket.version
  });

  
  res.send(ticket);
  
});

export { router as updateTicketRouter };