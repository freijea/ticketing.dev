import { Publisher, OrderCreatedEvent, Subjects } from "@sitehub-website/common/build";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
};

