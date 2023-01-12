import { Ticket } from "../ticket";
import {v4 as uuidv4, validate as uuidv4Validate } from 'uuid';

it('implements uuid', async () => {
  const ticket = Ticket.build({
    id: uuidv4(),
    title: 'NEW CONCERT',
    price: 20
  });

  await ticket.save();

  expect(uuidv4Validate(ticket.id)).toBe(true)

});