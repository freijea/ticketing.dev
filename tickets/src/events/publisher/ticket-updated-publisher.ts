import { Publisher, Subjects, TicketUpdatedEvent } from "@sitehub-website/common/build";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  
};