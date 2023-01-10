import { Subjects, Publisher, OrderCancelledEvent } from "@sitehub-website/common/build";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
};