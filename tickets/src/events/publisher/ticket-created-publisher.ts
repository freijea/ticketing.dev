import { Publisher, Subjects, TicketCreatedEvent } from "@sitehub-website/common/build";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  
};