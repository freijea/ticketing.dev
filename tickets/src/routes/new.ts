import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth } from '@sitehub-website/common/build';
import { validateRequest } from '@sitehub-website/common/build';
import { TicketCreatedPublisher } from '../events/publisher/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';

import { Ticket } from '../models/tickets';

const router = express.Router();

router.post('/api/tickets', 
  requireAuth, [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than zero')
],
  validateRequest, 
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id
    })

    await ticket.save();

    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId
    })

    res.status(201).send(ticket);
  });

export { router as createTicketRouter };

