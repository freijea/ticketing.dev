import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created.publisher';

console.clear();

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222'
});

stan.on('connect', async () => {
  console.log('Publisher connected to NATS!');

  const publisher = new TicketCreatedPublisher(stan);

  try {
    await publisher.publish({
      id: '123',
      title: 'concert',
      price: 20
    });
  } catch(err) {
    console.error(err);
  }

  ///const data = JSON.stringify({
    ///id: '123',
    ///title: 'concert',
    ///price: 20
  ///});

  ///stan.publish('ticket:created', data, () => {
    ///console.log('Event published');
  ///});

});

/// kubectl port-forward nats-depl-564558c478-jjxlj 4222:4222
/// kubectl port-forward nats-depl-564558c478-jjxlj 8222:8222
/// http://localhost:8222/streaming