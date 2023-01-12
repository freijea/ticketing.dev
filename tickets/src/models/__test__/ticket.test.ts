import { Ticket } from "../tickets";
import {v4 as uuidv4, validate as uuidv4Validate } from 'uuid';

it('implements uuid', async () => {
  //Create an instance of a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123'
  });

  //Save the ticket to the database
  await ticket.save();

  expect(uuidv4Validate(ticket.id)).toBe(true)

});

it('implements optmistic concurrency control', async () => {
  //Create an instance of a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123'
  });

  //Save the ticket to the database
  await ticket.save();

  //fecth the ticket twice
  const firsInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  //make two separte changes to the tickets we fetched
  firsInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });

  //save the first fetched ticket
  await firsInstance!.save();

  //save the second fetched ticket and expect an error
  try {
    await secondInstance!.save();
  } catch(err) {
    return;
  }

  throw new Error('Should not reach this point');
});

it('increments the version number on multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: '123'
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);

  await ticket.save();
  expect(ticket.version).toEqual(1);

  await ticket.save();
  expect(ticket.version).toEqual(2);

});