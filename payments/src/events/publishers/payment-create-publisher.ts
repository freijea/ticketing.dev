import { Subjects, Publisher, PaymentCreatedEvent } from "@sitehub-website/common/build";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
};